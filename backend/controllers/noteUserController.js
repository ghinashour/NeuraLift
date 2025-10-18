// backend/controllers/noteController.js
const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  try {
    const { content, mood } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const note = await Note.create({
      user: req.user._id, // assuming authentication middleware sets req.user
      content,
      mood,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUserNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateUserNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { content },
      { new: true } // return updated note
    );

    if (!updatedNote) return res.status(404).json({ error: "Note not found" });

    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
