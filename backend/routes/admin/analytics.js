const express = require('express');
const router = express.Router();
const { 
  getDetailedAnalytics, 
  getUserGrowth, 
  getFeatureUsage 
} = require('../../controllers/admin/analyticsController');

// Define routes with proper function references
router.get('/detailed', getDetailedAnalytics);
router.get('/user-growth', getUserGrowth);
router.get('/feature-usage', getFeatureUsage);

module.exports = router;