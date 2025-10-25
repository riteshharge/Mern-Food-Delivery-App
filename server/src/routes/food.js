import express from 'express';
import Food from '../models/Food.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const items = await Food.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', protect, adminOnly, async (req, res) => {
  const item = await Food.create(req.body);
  res.status(201).json(item);
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const item = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
