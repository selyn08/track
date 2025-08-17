const db = require('../db/db');
const { validationResult } = require('express-validator');

// Create a new trip
exports.createTrip = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { destination, cargo, commission_type } = req.body;
  const driver_id = req.driver.id; // from auth middleware

  try {
    const result = await db.run(
      'INSERT INTO trips (driver_id, destination, cargo, commission_type) VALUES (?, ?, ?, ?)',
      [driver_id, destination, cargo, commission_type]
    );

    const newTrip = await db.get('SELECT * FROM trips WHERE id = ?', [result.lastID]);
    res.status(201).json(newTrip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all trips
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await db.all('SELECT * FROM trips ORDER BY start_time DESC');
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get trips by driver
exports.getTripsByDriver = async (req, res) => {
    try {
      const trips = await db.all('SELECT * FROM trips WHERE driver_id = ? ORDER BY start_time DESC', [req.params.id]);
      res.json(trips);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

// Get ongoing trips
exports.getOngoingTrips = async (req, res) => {
    try {
        const trips = await db.all('SELECT * FROM trips WHERE end_time IS NULL ORDER BY start_time DESC');
        res.json(trips);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Update a trip
exports.updateTrip = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { destination, cargo, commission_type } = req.body;
  const tripId = req.params.id;

  try {
    let trip = await db.get('SELECT * FROM trips WHERE id = ?', [tripId]);
    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Ensure the driver owns the trip
    if (trip.driver_id !== req.driver.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await db.run(
      'UPDATE trips SET destination = ?, cargo = ?, commission_type = ? WHERE id = ?',
      [destination, cargo, commission_type, tripId]
    );

    const updatedTrip = await db.get('SELECT * FROM trips WHERE id = ?', [tripId]);
    res.json(updatedTrip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// End a trip
exports.endTrip = async (req, res) => {
    const tripId = req.params.id;
    try {
        let trip = await db.get('SELECT * FROM trips WHERE id = ?', [tripId]);
        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        // Ensure the driver owns the trip
        if (trip.driver_id !== req.driver.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if(trip.end_time) {
            return res.status(400).json({ msg: 'Trip has already ended.' });
        }

        await db.run(
            'UPDATE trips SET end_time = CURRENT_TIMESTAMP WHERE id = ?',
            [tripId]
        );

        const endedTrip = await db.get('SELECT * FROM trips WHERE id = ?', [tripId]);
        res.json(endedTrip);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    let trip = await db.get('SELECT * FROM trips WHERE id = ?', [tripId]);
    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Ensure the driver owns the trip
    if (trip.driver_id !== req.driver.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await db.run('DELETE FROM trips WHERE id = ?', [tripId]);

    res.json({ msg: 'Trip removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
