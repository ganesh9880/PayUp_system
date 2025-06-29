const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
// Controllers (to be implemented)
const groupController = require('../controllers/groupController');

// Get all groups for the current user
router.get('/', auth, groupController.getUserGroups);

// Get balances for all user's groups (must come before /:groupId)
router.get('/balances', auth, groupController.getUserBalances);

// Create a new group
router.post('/', auth, groupController.createGroup);

// Get group details (with balances)
router.get('/:groupId', auth, groupController.getGroupDetails);

// Test calculation (for debugging)
router.get('/:groupId/test-calculation', auth, groupController.testCalculation);

// Add a member to a group
router.post('/:groupId/members', auth, groupController.addMember);

// Add an expense to a group
router.post('/:groupId/expenses', auth, groupController.addExpense);

// Mark settlement as completed
router.put('/:groupId/expenses/:expenseId/settlements/:settlementId', auth, groupController.markSettlement);

// Send WhatsApp reminders to group members
router.post('/:groupId/remind', auth, groupController.sendReminders);

// Test Twilio functionality
router.get('/test-twilio', auth, groupController.testTwilio);

module.exports = router; 