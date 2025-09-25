const express = require('express');
const router = express.Router();
const {getUserNotifications, sendNotification, markNotificationAsRead, deleteNotification } = require('../controllers/notificationController');


router.get('/:Id', getUserNotifications);
router.post('/', sendNotification);
router.patch('/read', markNotificationAsRead);
router.delete('/', deleteNotification);

module.exports = router;