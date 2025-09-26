const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  sendNotification,
  markNotificationAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../controllers/authController');

router.use(protect);
router.get('/', getUserNotifications);
router.post('/', sendNotification);
router
  .route('/:notificationId')
  .patch(markNotificationAsRead)
  .delete(deleteNotification);

module.exports = router;
