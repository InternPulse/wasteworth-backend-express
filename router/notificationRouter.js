const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  sendNotification,
  markNotificationAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../controllers/authController');
const { cache } = require('../Middleware/cache');

router.use(protect);
router
  .route('/')
  .get(cache(300), getUserNotifications)
  .post(sendNotification);
router
  .route('/:notificationId')
  .patch(markNotificationAsRead)
  .delete(deleteNotification);

module.exports = router;