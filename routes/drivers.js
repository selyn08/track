const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const driverController = require('../controllers/driverController');

// @route   GET api/drivers/me
// @desc    Get current driver's profile
// @access  Private
router.get('/me', auth, driverController.getDriver);

// @route   PUT api/drivers
// @desc    Update driver profile
// @access  Private
router.put(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('working_hours', 'Working hours must be a number').optional().isNumeric(),
    ]
  ],
  driverController.updateDriver
);

// @route   DELETE api/drivers
// @desc    Delete driver
// @access  Private
router.delete('/', auth, driverController.deleteDriver);


module.exports = router;
