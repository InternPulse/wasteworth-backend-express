const express = require('express');
const router = express.Router();
const {getUserNotifications, sendNotification} = require('../controllers/notificationController');
const { protect } = require('../controllers/authController');

// router.use(protect);
router.get('/notifications/:userId', protect, getUserNotifications);
router.post('/notification',protect, sendNotification);

module.exports = router;