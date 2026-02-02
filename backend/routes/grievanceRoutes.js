const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public Routes (or at least accessible without strict login for now, per simple frontend)
router.post('/', grievanceController.submitGrievance);
router.get('/track/:id', grievanceController.trackGrievance);

// Protected Admin/Committee Routes
router.get('/', verifyToken, isAdmin, grievanceController.getAllGrievances);
router.put('/:id', verifyToken, isAdmin, grievanceController.updateStatus);

module.exports = router;
