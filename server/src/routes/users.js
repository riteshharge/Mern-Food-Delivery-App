import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ================= GET: Current user's profile =================
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) {
    console.error('GET /me error:', e);
    res.status(500).json({ message: e.message });
  }
});

// ================= PUT: Update profile =================
router.put('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, password, phone, addresses } = req.body;

    // If email is being changed, check if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) user.password = password;

    // ✅ Handle new multi-line address format (array of strings)
    if (Array.isArray(addresses)) {
      user.addresses = addresses.map(addr => {
        if (typeof addr === 'string') {
          // store simple string as { full: "string address" }
          return { full: addr };
        }
        return addr;
      });
    }

    await user.save();
    const out = user.toObject();
    delete out.password;
    res.json(out);

  } catch (e) {
    // ✅ Catch duplicate email (MongoDB error 11000)
    if (e.code === 11000 && e.keyPattern && e.keyPattern.email) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    console.error('PUT /me error:', e);
    res.status(500).json({ message: e.message });
  }
});

// ================= POST: Add a new address =================
router.post('/me/addresses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let addr = req.body;
    if (typeof addr === 'string') {
      addr = { full: addr };
    }

    user.addresses.push(addr);
    await user.save();
    res.status(201).json(user.addresses[user.addresses.length - 1]);
  } catch (e) {
    console.error('POST /me/addresses error:', e);
    res.status(500).json({ message: e.message });
  }
});

// ================= DELETE: Remove an address =================
router.delete('/me/addresses/:addrId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addr = user.addresses.id(req.params.addrId);
    if (addr) {
      addr.remove();
      await user.save();
      return res.json({ message: 'Deleted' });
    }

    res.status(404).json({ message: 'Address not found' });
  } catch (e) {
    console.error('DELETE /me/addresses error:', e);
    res.status(500).json({ message: e.message });
  }
});

export default router;
