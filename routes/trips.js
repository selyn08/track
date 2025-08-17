const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const tripController = require('../controllers/tripController');

// @route   POST api/trips
// @desc    Create a trip
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('destination', 'Destination is required').not().isEmpty(),
      check('cargo', 'Cargo is required').not().isEmpty(),
      check('commission_type', 'Commission type is required').not().isEmpty(),
    ],
  ],
  tripController.createTrip
);

// @route   GET api/trips
// @desc    Get all trips
// @access  Private
router.get('/', auth, tripController.getAllTrips);

// @route   GET api/trips/driver/:id
// @desc    Get trips by driver id
// @access  Private
router.get('/driver/:id', auth, tripController.getTripsByDriver);

// @route   GET api/trips/ongoing
// @desc    Get all ongoing trips
// @access  Private
router.get('/ongoing', auth, tripController.getOngoingTrips);

// @route   PUT api/trips/:id
// @desc    Update a trip
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
        check('destination', 'Destination is required').not().isEmpty(),
        check('cargo', 'Cargo is required').not().isEmpty(),
        check('commission_type', 'Commission type is required').not().isEmpty(),
    ],
  ],
  tripController.updateTrip
);

// @route   PUT api/trips/:id/end
// @desc    End a trip
// @access  Private
router.put('/:id/end', auth, tripController.endTrip);


// @route   DELETE api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete('/:id', auth, tripController.deleteTrip);

module.exports = router;
