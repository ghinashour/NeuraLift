const express = require('express');
const router = express.Router();
const {
  getMedicines,
  getMedicineStats,
  createMedicine,
  updateMedicine,
  markMedicineTaken,
  deleteMedicine,
  getTodayMedicines,
  getUpcomingMedicines
} = require('../controllers/medicineController');
const  protect  = require('../middleware/auth');

// Apply authentication middleware to all medicine routes
router.use(protect);
// Routes
router.get('/', getMedicines);
router.get('/stats', getMedicineStats);
router.get('/today', getTodayMedicines);
router.get('/upcoming', getUpcomingMedicines);
router.post('/', createMedicine);
router.put('/:id', updateMedicine);
router.put('/:id/take', markMedicineTaken);
router.delete('/:id', deleteMedicine);

module.exports = router;