const User = require('../models/User');

exports.listUsers = async (req, res) => {
  try {
    console.log('listUsers called');
    const { q } = req.query;
    let filter = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      filter = {
        $or: [
          { name: regex },
          { email: regex },
          { whatsapp: regex }
        ]
      };
    }
    console.log('Filter:', filter);
    const users = await User.find(filter).select('-password');
    console.log('Found users:', users.length);
    console.log('Users:', users.map(u => ({ name: u.name, whatsapp: u.whatsapp })));
    res.status(200).json(users);
  } catch (err) {
    console.error('Error in listUsers:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 