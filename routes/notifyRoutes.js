const express = require('express');
const router = express.Router();

const {
  createNotification,
  getNotification,
} = require('../controllers/notificationController');

// Routes Prefix => "/notifications"

// Get Notifications
router.route('/').post(createNotification);

router.route("/:userId").get(getNotification)

module.exports = router;
