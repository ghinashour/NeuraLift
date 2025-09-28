const mongoose = require('mongoose');
const SuccessStory = require('./models/SuccessStory');
require('dotenv').config();

const successStories = [
    {
        title: "Completed 30-Day Meditation Challenge",
        author: "Sarah M.",
        description: "After struggling with stress and anxiety, I committed to meditating for 10 minutes every day. Today marks 30 days straight! I feel more centered, focused, and calm. My relationships have improved and I'm sleeping better than ever.",
        category: "Mental Health",
        achievement: "30 days of consistent meditation",
        likeCount: 12,
        shareCount: 5,
        isPublic: true,
        isFeatured: true,
        tags: ["meditation", "stress relief", "mindfulness"]
    },
    {
        title: "Finally Established a Morning Routine",
        author: "Mike R.",
        description: "For years I was chaotic in the mornings. Using the focus timer and task manager here, I built a consistent 6 AM routine: exercise, journaling, and planning my day. It's been 3 weeks and I feel incredible!",
        category: "Productivity",
        achievement: "3 weeks of consistent morning routine",
        likeCount: 8,
        shareCount: 3,
        isPublic: true,
        isFeatured: true,
        tags: ["routine", "productivity", "habits"]
    },
    {
        title: "Launched My Side Business",
        author: "Emma L.",
        description: "The task management and focus sessions helped me stay accountable to my business goals. After 6 months of consistent evening work sessions, I finally launched my online store. Already made my first sale!",
        category: "Career",
        achievement: "Launched online store with first sale",
        likeCount: 15,
        shareCount: 8,
        isPublic: true,
        isFeatured: true,
        tags: ["entrepreneurship", "goals", "business"]
    },
    {
        title: "Overcame Social Anxiety",
        author: "Alex K.",
        description: "I used to avoid social situations completely. Through the community features and gradual exposure exercises, I've built confidence to attend networking events and even speak at a local meetup!",
        category: "Personal Growth",
        achievement: "Spoke at local meetup",
        likeCount: 22,
        shareCount: 12,
        isPublic: true,
        isFeatured: false,
        tags: ["social anxiety", "confidence", "networking"]
    },
    {
        title: "Improved Work-Life Balance",
        author: "Jennifer T.",
        description: "As a working mom, I was constantly stressed and overwhelmed. The time management tools and stress relief features helped me create boundaries and find time for myself again.",
        category: "Stress Relief",
        achievement: "Better work-life balance achieved",
        likeCount: 18,
        shareCount: 7,
        isPublic: true,
        isFeatured: false,
        tags: ["work-life balance", "parenting", "stress management"]
    },
    {
        title: "Built Healthy Sleep Habits",
        author: "David P.",
        description: "I was a chronic night owl with terrible sleep patterns. The sleep tracking and wind-down routines helped me establish a consistent bedtime and wake up feeling refreshed.",
        category: "Health",
        achievement: "Consistent 8-hour sleep schedule",
        likeCount: 14,
        shareCount: 6,
        isPublic: true,
        isFeatured: false,
        tags: ["sleep", "health", "habits"]
    },
    {
        title: "Completed My First Marathon",
        author: "Lisa M.",
        description: "Never thought I could run a marathon, but the goal-setting features and progress tracking kept me motivated through months of training. Crossed the finish line last weekend!",
        category: "Health",
        achievement: "Completed first marathon",
        likeCount: 25,
        shareCount: 15,
        isPublic: true,
        isFeatured: false,
        tags: ["fitness", "goals", "marathon", "achievement"]
    },
    {
        title: "Reduced Screen Time by 50%",
        author: "Tom W.",
        description: "I was addicted to my phone and social media. The digital wellness features helped me set boundaries and rediscover hobbies I'd forgotten about.",
        category: "Personal Growth",
        achievement: "50% reduction in screen time",
        likeCount: 16,
        shareCount: 9,
        isPublic: true,
        isFeatured: false,
        tags: ["digital wellness", "mindfulness", "hobbies"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to MongoDB ✅");

        // Clear existing success stories
        await SuccessStory.deleteMany({});
        console.log("Cleared existing success stories 🗑️");

        // Insert new success stories
        await SuccessStory.insertMany(successStories);
        console.log("Database seeded with Success Stories ✅");

        // Display what was added
        const count = await SuccessStory.countDocuments();
        console.log(`Total success stories added: ${count} 📊`);

        // Show sample of added stories
        const sampleStories = await SuccessStory.find().limit(3);
        console.log("\nSample of added stories:");
        sampleStories.forEach((story, index) => {
            console.log(`${index + 1}. ${story.title} by ${story.author} - ${story.category}`);
        });

        // Show featured stories
        const featuredStories = await SuccessStory.find({ isFeatured: true });
        console.log(`\nFeatured stories: ${featuredStories.length}`);
        featuredStories.forEach((story, index) => {
            console.log(`${index + 1}. ${story.title} by ${story.author}`);
        });

        mongoose.connection.close();
        console.log("\nDatabase connection closed 🔒");
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedDB();
