// controllers/medicineController.js
const Medicine = require("../models/Medicine");
const Notification = require("../models/Notification");

exports.createMedicineReminder = async (req, res) => {
  try {
    const med = await Medicine.create(req.body);

    await Notification.create({
      user: med.user,
      type: "medicine",
      title: `Medicine Reminder: ${med.name}`,
      description: `Time to take your medicine: ${med.name}`
    });

    res.status(201).json(med);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
