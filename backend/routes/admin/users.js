// routes/admin/users.js
const express = require('express');
const User = require('../../models/User');
const AuditLog = require('../../models/AuditLog');

const router = express.Router();

// GET /api/admin/users?page=1&limit=20&q=alice&status=suspended
router.get('/', async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1'), 1);
  const limit = Math.min(parseInt(req.query.limit || '20'), 200);
  const q = req.query.q;
  const status = req.query.status;

  const filter = {};
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ];
  }
  if (status === 'suspended') filter.isSuspended = true;
  if (status === 'active') filter.isSuspended = false;

  try {
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-passwordHash')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ users, total, page, limit });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/users/:id
router.get('/:id', async (req, res) => {
  try {
    const u = await User.findById(req.params.id).select('-passwordHash');
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json(u);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id  -- edit profile (admin)
router.put('/:id', async (req, res) => {
  try {
    const patch = {};
    ['name', 'avatarUrl'].forEach(f => { if (req.body[f] !== undefined) patch[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.params.id, patch, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // audit
    await AuditLog.create({
      adminId: req.user._id,
      action: 'update_user',
      target: `User:${user._id}`,
      details: { patch }
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/users/:id/suspend
router.post('/:id/suspend', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isSuspended: true }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    await AuditLog.create({
      adminId: req.user._id,
      action: 'suspend_user',
      target: `User:${user._id}`,
      details: { reason: req.body.reason || 'suspended by admin' }
    });

    res.json({ message: 'User suspended', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/users/:id/unsuspend
router.post('/:id/unsuspend', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isSuspended: false }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    await AuditLog.create({
      adminId: req.user._id,
      action: 'unsuspend_user',
      target: `User:${user._id}`,
      details: {}
    });

    res.json({ message: 'User unsuspended', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/users/:id/reset-password  (admin forced reset)
router.post('/:id/reset-password', async (req, res) => {
  try {
    const newPassword = req.body.newPassword || Math.random().toString(36).slice(-10); // secure in prod
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.setPassword(newPassword);
    await user.save();

    await AuditLog.create({
      adminId: req.user._id,
      action: 'reset_password',
      target: `User:${user._id}`,
      details: { byAdmin: true }
    });

    // In production: send the new password by email / require user to set a new password on next login.
    res.json({ message: 'Password reset', newPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
