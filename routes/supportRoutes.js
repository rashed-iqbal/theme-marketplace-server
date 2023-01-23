const express = require('express');
const router = express.Router();

const {
  createSupport,
  getSupport,
  updateSupport,
  deleteSupport,
} = require('../controllers/supportController');

// Routes Prefix => "/supports"

// Create support & Get support
router.route('/').post(createSupport);

// Update & Delete support
router.route('/:id').get(getSupport).put(updateSupport).delete(deleteSupport);

module.exports = router;
