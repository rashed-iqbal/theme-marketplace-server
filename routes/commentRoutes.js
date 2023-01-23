const express = require('express');
const router = express.Router();

const {
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

// Routes Prefix => "/comments"

// Create Comment
router.route('/').post(createComment);

// Update & Delete Comment
router.route('/:id').put(updateComment).delete(deleteComment);

module.exports = router;
