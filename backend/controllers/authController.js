const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Use environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || '2a3c4d747321489d273d77b8ab0c3afce85878c77ab432b74ca0f5fd1905a1b6';

exports.register = async (req, res) => {
  try {
    const { name, email, whatsapp, password } = req.body;
    if (!name || !email || !whatsapp || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { whatsapp }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or WhatsApp already registered.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, whatsapp, password: hashedPassword });
    await user.save();
    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, whatsapp: user.whatsapp } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrWhatsapp, password } = req.body;
    if (!emailOrWhatsapp || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // Find user by email or whatsapp
    const user = await User.findOne({ $or: [{ email: emailOrWhatsapp }, { whatsapp: emailOrWhatsapp }] });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { _id: user._id, name: user.name, email: user.email, whatsapp: user.whatsapp } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 