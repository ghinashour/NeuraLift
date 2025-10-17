const SuccessStory = require('../../models/SuccessStory');
const User = require('../../models/User');

// Get all success stories (Admin)
const getAllStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const total = await SuccessStory.countDocuments(filter);

    const stories = await SuccessStory.find(filter)
      .populate("userId", "username email profilePhoto")
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: {
        stories,
        pagination: {
          totalStories: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update story (Admin)
const updateStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: "Story not found" });

    const updates = req.body;
    Object.assign(story, updates);
    await story.save();

    await story.populate("userId", "username email profilePhoto");

    res.json({ success: true, message: "Story updated", data: story });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete story (Admin)
const deleteStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: "Story not found" });

    res.json({ success: true, message: "Story deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Feature / unfeature story
const toggleFeatureStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: "Story not found" });

    story.isFeatured = !story.isFeatured;
    await story.save();

    res.json({ success: true, message: story.isFeatured ? "Story featured" : "Story unfeatured", data: story });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllStories,
  updateStory,
  deleteStory,
  toggleFeatureStory
};
