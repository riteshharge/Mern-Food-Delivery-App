import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const sign = (user) => jwt.sign(
  { id: user._id, email: user.email, role: user.role, name: user.name },
  process.env.JWT_SECRET || 'dev',
  { expiresIn: '7d' }
);

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email in use' });
    const user = await User.create({ name, email, password });
    return res.json({ token: sign(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid creds' });
    return res.json({ token: sign(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
