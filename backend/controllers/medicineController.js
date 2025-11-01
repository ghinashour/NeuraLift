const Medicine = require('../models/Medicine');
const asyncHandler = require('express-async-handler');

// ✅ Convert "HH:mm" → Date for today
const convertTimeToDate = (timeStr) => {
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

// ✅ Get all medicines
const getMedicines = asyncHandler(async (req, res) => {
  const medicines = await Medicine.find({ user: req.user.id }).sort({ time: 1 });
  res.status(200).json(medicines);
});

// ✅ Create new medicine
const createMedicine = asyncHandler(async (req, res) => {
  let { name, capsule, time, repeat } = req.body;

  if (!name || !time) {
    res.status(400);
    throw new Error('Name and time are required');
  }

  // Ensure valid Date
  const date = convertTimeToDate(time);

  const medicine = await Medicine.create({
    name,
    capsule,
    time: date,
    repeat,
    user: req.user.id,
  });

  res.status(201).json(medicine);
});

// ✅ Update medicine
const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);

  if (!medicine) {
    res.status(404);
    throw new Error('Medicine not found');
  }

  if (medicine.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Convert time if updating
  if (req.body.time && typeof req.body.time === "string") {
    req.body.time = convertTimeToDate(req.body.time);
  }

  const updated = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updated);
});

// ✅ Mark as taken (no deletion)
const markMedicineTaken = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  if (medicine.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  medicine.taken = true;
  await medicine.save();

  res.status(200).json(medicine);
});

// ✅ Delete medicine
const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error('Medicine not found');
  }

  if (medicine.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await medicine.deleteOne();
  res.status(200).json({ message: "Deleted successfully" });
});











// @desc    Get medicine statistics
// @route   GET /api/medicines/stats
// @access  Private
const getMedicineStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const now = new Date();
  
  // Today's start and end
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd = new Date(now.setHours(23, 59, 59, 999));
  
  // Today's medicines
  const todayMeds = await Medicine.find({
    user: userId,
    time: { $gte: todayStart, $lte: todayEnd }
  });
  
  // Upcoming medicines (next 7 days)
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  
  const upcomingMeds = await Medicine.find({
    user: userId,
    time: { $gt: now, $lte: nextWeek },
    taken: false
  }).sort({ time: 1 });
  
  // Week's progress (this week)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekMedsTaken = await Medicine.find({
    user: userId,
    time: { $gte: weekStart },
    taken: true
  });
  
  const totalWeekMeds = await Medicine.find({
    user: userId,
    time: { $gte: weekStart }
  });
  
  const weekProgress = totalWeekMeds.length > 0 
    ? Math.round((weekMedsTaken.length / totalWeekMeds.length) * 100)
    : 0;
  
  // Find nearest upcoming medicine
  const nearestUpcoming = upcomingMeds.length > 0 ? upcomingMeds[0] : null;
  const upcomingDays = nearestUpcoming 
    ? Math.ceil((new Date(nearestUpcoming.time) - now) / (1000 * 60 * 60 * 24))
    : 0;
  
  res.status(200).json({
    todayCount: todayMeds.length,
    upcomingDays: upcomingDays,
    weekProgress: weekProgress,
    totalMedicines: await Medicine.countDocuments({ user: userId })
  });
});





// @desc    Get today's medicines
// @route   GET /api/medicines/today
// @access  Private
const getTodayMedicines = asyncHandler(async (req, res) => {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd = new Date(now.setHours(23, 59, 59, 999));
  
  const todayMedicines = await Medicine.find({
    user: req.user.id,
    time: { $gte: todayStart, $lte: todayEnd }
  }).sort({ time: 1 });
  
  res.status(200).json(todayMedicines);
});

// @desc    Get upcoming medicines
// @route   GET /api/medicines/upcoming
// @access  Private
const getUpcomingMedicines = asyncHandler(async (req, res) => {
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  
  const upcomingMedicines = await Medicine.find({
    user: req.user.id,
    time: { $gt: now, $lte: nextWeek },
    taken: false
  }).sort({ time: 1 });
  
  res.status(200).json(upcomingMedicines);
});

module.exports = {
  getMedicines,
  getMedicineStats,
  createMedicine,
  updateMedicine,
  markMedicineTaken,
  deleteMedicine,
  getTodayMedicines,
  getUpcomingMedicines
};