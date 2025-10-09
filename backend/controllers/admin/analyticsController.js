const User = require('../../models/User');
const Mood = require('../../models/Mood');
const Task = require('../../models/Task');
const SuccessStory = require('../../models/SuccessStory');

exports.getDetailedAnalytics = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    const dateRange = getDateRange(period);
    
    const [userGrowth, moodTrends, taskCompletion] = await Promise.all([
      getUserGrowthData(dateRange),
      getMoodTrends(dateRange),
      getTaskCompletionData(dateRange)
    ]);

    res.json({
      userGrowth,
      moodTrends,
      taskCompletion,
      period
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

exports.getUserGrowth = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const growthData = await getUserGrowthData(getDateRange(`${days}d`));
    res.json(growthData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user growth data', error: error.message });
  }
};

exports.getFeatureUsage = async (req, res) => {
  try {
    const featureUsage = await getFeatureUsageData();
    res.json(featureUsage);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feature usage', error: error.message });
  }
};

// Helper functions
async function getUserGrowthData(dateRange) {
  try {
    const growth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.start }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);
    
    return growth;
  } catch (error) {
    console.error('Error getting user growth data:', error);
    return [];
  }
}

async function getMoodTrends(dateRange) {
  try {
    const trends = await Mood.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.start }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            mood: '$mood'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    return trends;
  } catch (error) {
    console.error('Error getting mood trends:', error);
    return [];
  }
}

async function getTaskCompletionData(dateRange) {
  try {
    const completion = await Task.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.start }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            completed: '$completed'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    return completion;
  } catch (error) {
    console.error('Error getting task completion data:', error);
    return [];
  }
}

async function getFeatureUsageData() {
  try {
    const [moodCount, taskCount, storyCount, userCount] = await Promise.all([
      Mood.countDocuments(),
      Task.countDocuments(),
      SuccessStory.countDocuments(),
      User.countDocuments()
    ]);

    return [
      { feature: 'Mood Tracking', usage: moodCount },
      { feature: 'Task Management', usage: taskCount },
      { feature: 'Success Stories', usage: storyCount },
      { feature: 'User Profiles', usage: userCount }
    ];
  } catch (error) {
    console.error('Error getting feature usage:', error);
    return [];
  }
}

function getDateRange(period) {
  const now = new Date();
  const start = new Date();
  
  switch (period) {
    case '7d':
      start.setDate(now.getDate() - 7);
      break;
    case '30d':
      start.setDate(now.getDate() - 30);
      break;
    case '90d':
      start.setDate(now.getDate() - 90);
      break;
    default:
      start.setDate(now.getDate() - 7);
  }
  
  return { start, end: now };
}