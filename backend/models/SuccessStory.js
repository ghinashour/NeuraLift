const mongoose = require("mongoose");

const successStorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    author: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    category: {
        type: String,
        required: true,
        enum: ['Mindfulness', 'Habits', 'Goals', 'Health', 'Career', 'Relationships', 'Learning', 'Fitness'],
        default: 'Habits'
    },
    likeCount: {
        type: Number,
        default: 0,
        min: 0
    },
    shareCount: {
        type: Number,
        default: 0,
        min: 0
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: 50
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow anonymous stories
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for better query performance
successStorySchema.index({ category: 1, isPublic: 1, createdAt: -1 });
successStorySchema.index({ userId: 1 });
successStorySchema.index({ isFeatured: 1, createdAt: -1 });

// Virtual for total engagement (likes + shares)
successStorySchema.virtual('totalEngagement').get(function () {
    return this.likeCount + this.shareCount;
});

// Method to check if user has liked the story
successStorySchema.methods.hasUserLiked = function (userId) {
    return this.likes.includes(userId);
};

// Pre-save middleware to sync likeCount with likes array
successStorySchema.pre('save', function (next) {
    if (this.isModified('likes')) {
        this.likeCount = this.likes.length;
    }
    next();
});

// Method to toggle like
successStorySchema.methods.toggleLike = function (userId) {
    const hasLiked = this.hasUserLiked(userId);

    if (hasLiked) {
        this.likes.pull(userId);
    } else {
        this.likes.addToSet(userId);
    }

    // likeCount will be automatically synced by pre-save middleware
    return !hasLiked; // Return true if now liked, false if now unliked
};

module.exports = mongoose.model("SuccessStory", successStorySchema);
