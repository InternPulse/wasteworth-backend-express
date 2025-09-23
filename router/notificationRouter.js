const express = require('express');
const router = express.Router();
const {getUserNotifications, sendNotification} = require('../controllers/notificationController');


router.get('/:Id', getUserNotifications);
router.post('/', sendNotification);

module.exports = router;