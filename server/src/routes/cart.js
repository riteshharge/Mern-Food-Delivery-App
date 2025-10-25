import express from 'express';
import Food from '../models/Food.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// client maintains cart; server validates and prices items
router.post('/price', protect, async (req, res) => {
  const { items = [] } = req.body; // [{food:id, qty}]
  if (!items.length) return res.json({ items: [], total: 0 });

  const ids = items.map(i => i.food);
  const foods = await Food.find({ _id: { $in: ids } });
  const map = new Map(foods.map(f => [String(f._id), f]));

  const priced = items.map(i => {
    const food = map.get(String(i.food));
    const price = food ? food.price : 0;
    const name = food ? food.name : 'Unknown Item';
    return {
      food: i.food,
      foodName: name, // ✅ added foodName
      qty: i.qty,
      price,
      subtotal: price * i.qty,
    };
  });

  const total = priced.reduce((a, b) => a + b.subtotal, 0);
  res.json({ items: priced, total });
});

export default router;
