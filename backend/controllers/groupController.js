const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');
const twilio = require('twilio');

// Use environment variables for Twilio credentials
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
const UPI_ID = process.env.UPI_ID || '';

exports.createGroup = async (req, res) => {
  try {
    const { name, description, members, upiId } = req.body;
    const creatorId = req.user.userId;
    
    console.log('Creating group with data:', { name, description, members, upiId, creatorId });
    
    if (!name || !members || !Array.isArray(members) || members.length === 0) {
      console.log('Validation failed:', { name, members, isArray: Array.isArray(members), length: members?.length });
      return res.status(400).json({ message: 'Name and at least one member are required.' });
    }
    
    // Ensure all members exist
    const users = await User.find({ _id: { $in: members } });
    console.log('Found users:', users.length, 'out of', members.length, 'requested');
    if (users.length !== members.length) {
      return res.status(400).json({ message: 'One or more members not found.' });
    }
    
    // Add creator to members if not already included
    const allMembers = [...new Set([...members, creatorId])];
    console.log('Final members list:', allMembers);
    
    const group = new Group({ 
      name, 
      description, 
      creator: creatorId,
      upiId: upiId || UPI_ID, // Use provided UPI ID or default
      members: allMembers 
    });
    await group.save();
    
    console.log('Group created successfully:', group._id);
    
    // Populate members before sending response
    await group.populate('members', 'name email whatsapp');
    await group.populate('creator', 'name email whatsapp');
    res.status(201).json(group);
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groups = await Group.find({ members: userId })
      .populate('members', 'name email whatsapp')
      .populate('creator', 'name email whatsapp');
    
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserBalances = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groups = await Group.find({ members: userId });
    
    const balances = {};
    
    for (const group of groups) {
      const expenses = await Expense.find({ group: group._id })
        .populate('paidBy', 'name')
        .populate('participants', 'name');
      
      let balance = 0;
      
      expenses.forEach(exp => {
        const sharePerPerson = exp.amount / exp.participants.length;
        
        // If user is a participant, they owe their share
        if (exp.participants.some(p => p._id.toString() === userId)) {
          balance -= sharePerPerson;
        }
        
        // If user paid, they get the full amount back
        if (exp.paidBy._id.toString() === userId) {
          balance += exp.amount;
        }
      });
      
      balances[group._id.toString()] = Math.round((balance + Number.EPSILON) * 100) / 100;
    }
    
    res.status(200).json(balances);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId)
      .populate('members', 'name email whatsapp')
      .populate('creator', 'name email whatsapp');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }
    
    // Fetch all expenses for this group with settlements
    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name')
      .populate('participants', 'name')
      .populate('settlements.participant', 'name')
      .populate('settlements.settledBy', 'name');
    
    // Calculate balances
    const balances = {};
    group.members.forEach(member => {
      balances[member._id.toString()] = 0;
    });
    
    expenses.forEach(exp => {
      const sharePerPerson = exp.amount / exp.participants.length;
      console.log(`Expense: ${exp.description} - Amount: ${exp.amount}, Share per person: ${sharePerPerson}`);
      
      // Each participant owes their share
      exp.participants.forEach(participant => {
        const participantId = participant._id || participant;
        const participantIdStr = participantId.toString();
        if (balances[participantIdStr] !== undefined) {
          balances[participantIdStr] -= sharePerPerson;
          console.log(`  ${participantIdStr} owes: ${sharePerPerson}`);
        }
      });
      
      // The person who paid gets the full amount back
      const paidBy = exp.paidBy._id || exp.paidBy;
      const paidByIdStr = paidBy.toString();
      if (balances[paidByIdStr] !== undefined) {
        balances[paidByIdStr] += exp.amount;
        console.log(`  ${paidByIdStr} paid: ${exp.amount}`);
      }
    });
    
    console.log('Final balances:', balances);
    
    // Attach balances to members
    const membersWithBalances = group.members.map(member => ({
      ...member.toObject(),
      balance: Math.round((balances[member._id.toString()] + Number.EPSILON) * 100) / 100
    }));
    
    res.status(200).json({ 
      ...group.toObject(), 
      expenses, 
      members: membersWithBalances 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.testCalculation = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }
    
    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name')
      .populate('participants', 'name');
    
    const balances = {};
    group.members.forEach(member => {
      balances[member._id.toString()] = 0;
    });
    
    expenses.forEach(exp => {
      const sharePerPerson = exp.amount / exp.participants.length;
      
      exp.participants.forEach(participant => {
        const participantId = participant._id || participant;
        const participantIdStr = participantId.toString();
        if (balances[participantIdStr] !== undefined) {
          balances[participantIdStr] -= sharePerPerson;
        }
      });
      
      const paidBy = exp.paidBy._id || exp.paidBy;
      const paidByIdStr = paidBy.toString();
      if (balances[paidByIdStr] !== undefined) {
        balances[paidByIdStr] += exp.amount;
      }
    });
    
    res.status(200).json({ balances, expenses });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }
    if (group.members.includes(userId)) {
      return res.status(409).json({ message: 'User already in group.' });
    }
    group.members.push(userId);
    await group.save();
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { description, amount, paidBy, participants } = req.body;
    if (!description || !amount || !paidBy || !participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }
    // Validate paidBy and participants are group members
    if (!group.members.map(id => id.toString()).includes(paidBy)) {
      return res.status(400).json({ message: 'Payer must be a group member.' });
    }
    for (const userId of participants) {
      if (!group.members.map(id => id.toString()).includes(userId)) {
        return res.status(400).json({ message: 'All participants must be group members.' });
      }
    }
    
    // Calculate share per person
    const sharePerPerson = amount / participants.length;
    
    // Create settlements for each participant (except the payer)
    const settlements = [];
    participants.forEach(participantId => {
      if (participantId.toString() !== paidBy.toString()) {
        settlements.push({
          participant: participantId,
          amount: sharePerPerson,
          settled: false
        });
      }
    });
    
    const expense = new Expense({
      description,
      amount,
      paidBy,
      participants,
      settlements,
      group: groupId
    });
    await expense.save();
    
    // Populate the expense before sending response
    await expense.populate('paidBy', 'name');
    await expense.populate('participants', 'name');
    await expense.populate('settlements.participant', 'name');
    
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.markSettlement = async (req, res) => {
  try {
    const { groupId, expenseId, settlementId } = req.params;
    const { settledBy } = req.body;
    
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found.' });
    }
    
    const settlement = expense.settlements.id(settlementId);
    if (!settlement) {
      return res.status(404).json({ message: 'Settlement not found.' });
    }
    
    settlement.settled = true;
    settlement.settledBy = settledBy;
    settlement.settledAt = new Date();
    
    await expense.save();
    
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.sendReminders = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId)
      .populate('members', 'name whatsapp');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }
    
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      return res.status(400).json({ message: 'Twilio credentials not configured.' });
    }
    
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    
    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name')
      .populate('participants', 'name');
    
    // Calculate balances
    const balances = {};
    group.members.forEach(member => {
      balances[member._id.toString()] = 0;
    });
    
    expenses.forEach(exp => {
      const sharePerPerson = exp.amount / exp.participants.length;
      
      exp.participants.forEach(participant => {
        const participantId = participant._id || participant;
        const participantIdStr = participantId.toString();
        if (balances[participantIdStr] !== undefined) {
          balances[participantIdStr] -= sharePerPerson;
        }
      });
      
      const paidBy = exp.paidBy._id || exp.paidBy;
      const paidByIdStr = paidBy.toString();
      if (balances[paidByIdStr] !== undefined) {
        balances[paidByIdStr] += exp.amount;
      }
    });
    
    // Send reminders to members with negative balances
    const sentMessages = [];
    for (const member of group.members) {
      const balance = balances[member._id.toString()];
      if (balance < 0 && member.whatsapp) {
        try {
          const message = await client.messages.create({
            body: `Hi ${member.name}! You owe ₹${Math.abs(balance).toFixed(2)} in the group "${group.name}". Please settle your dues soon!`,
            from: TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${member.whatsapp}`
          });
          sentMessages.push({ member: member.name, messageId: message.sid });
        } catch (error) {
          console.error(`Failed to send message to ${member.name}:`, error);
        }
      }
    }
    
    res.status(200).json({ 
      message: 'Reminders sent successfully', 
      sentMessages,
      balances 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.testTwilio = async (req, res) => {
  try {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      return res.status(400).json({ message: 'Twilio credentials not configured.' });
    }
    
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    
    // Test Twilio connection
    const account = await client.api.accounts(TWILIO_ACCOUNT_SID).fetch();
    
    res.status(200).json({ 
      message: 'Twilio connection successful',
      accountSid: account.sid,
      accountName: account.friendlyName
    });
  } catch (err) {
    res.status(500).json({ message: 'Twilio test failed', error: err.message });
  }
}; 