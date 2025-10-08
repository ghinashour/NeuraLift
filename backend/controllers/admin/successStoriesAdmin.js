const SuccessStory = require("../../models/SuccessStory");
const mongoose = require("mongoose");

// Get all stories (admin only)
exports.getAllStories = async (req, res) => {
  try {
    const {
      category,
      isFeatured,
      isPublic,
      author,
      tags,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";
    if (isPublic !== undefined) query.isPublic = isPublic === "true";
    if (author) query.author = { $regex: author, $options: "i" };
    if (tags) query.tags = { $in: tags.split(",").map(tag => tag.trim()) };

    const stories = await SuccessStory.find(query)
      .populate("userId", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await SuccessStory.countDocuments(query);

    res.json({ total, page: Number(page), stories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a story (admin only)
exports.deleteStory = async (req, res) => {
  try {
    await SuccessStory.findByIdAndDelete(req.params.id);
    res.json({ message: "Story deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Feature/unfeature story
exports.toggleFeature = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ error: "Story not found" });

    story.isFeatured = !story.isFeatured;
    await story.save();

    res.json({ message: `Story isFeatured set to ${story.isFeatured}`, story });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Analytics: top stories by engagement, stories per category, most active authors
exports.storyAnalytics = async (req, res) => {
  try {
    const topStories = await SuccessStory.find()
      .sort({ likeCount: -1, shareCount: -1 })
      .limit(5)
      .select("title author likeCount shareCount totalEngagement");

    const storiesPerCategory = await SuccessStory.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const activeAuthors = await SuccessStory.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({ topStories, storiesPerCategory, activeAuthors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
