import express from 'express';
import Order from '../models/Order.js';
import Food from '../models/Food.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all orders for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.food');
    res.json(orders);
  } catch (e) {
    console.error('GET /orders error:', e);
    res.status(500).json({ message: e.message });
  }
});

// Place new order
router.post('/', protect, async (req, res) => {
  try {
    const { items = [], address } = req.body;

    if (!items.length) {
      return res.status(400).json({ message: 'Empty order' });
    }

    // ✅ Handle both structured and "full" address formats
    if (!address || (!address.line1 && !address.full && typeof address !== 'string')) {
      return res.status(400).json({ message: 'Address required' });
    }

    // Normalize address format
    let normalizedAddress = address;
    if (typeof address === 'string') {
      normalizedAddress = { full: address };
    } else if (address.full && !address.line1) {
      normalizedAddress = { full: address.full };
    }

    // Calculate total
    const foods = await Food.find({ _id: { $in: items.map(i => i.food) } });
    const map = new Map(foods.map(f => [String(f._id), f.price]));
    const total = items.reduce((a, b) => a + (map.get(String(b.food)) || 0) * b.qty, 0);

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      address: normalizedAddress
    });

    res.status(201).json(order);
  } catch (e) {
    console.error('POST /orders error:', e);
    res.status(500).json({ message: e.message });
  }
});

export default router;
