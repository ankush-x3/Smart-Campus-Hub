const express = require('express');
const router = express.Router();
const LostFound = require('../models/LostFound');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const items = await LostFound.find({ status: 'active' }).populate('postedBy','name role department').sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const item = await LostFound.create({ ...req.body, postedBy: req.user._id || req.user.id });
    await item.populate('postedBy','name role department');
    
    await AuditLog.create({
      action: 'Lost/Found Item Created',
      details: `Created item: ${item.title}`,
      user: req.user.id,
      type: 'system'
    });
    
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    const userId = (req.user._id || req.user.id).toString();
    if (item.postedBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const updated = await LostFound.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('postedBy','name role');
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id/resolve', protect, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    const userId = (req.user._id || req.user.id).toString();
    if (item.postedBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    item.status = 'resolved';
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    const userId = (req.user._id || req.user.id).toString();
    if (item.postedBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await LostFound.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
