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
    const newTrip = await db.query(
      'INSERT INTO trips (driver_id, destination, cargo, commission_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [driver_id, destination, cargo, commission_type]
    );

    res.status(201).json(newTrip.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all trips
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await db.query('SELECT * FROM trips ORDER BY start_time DESC');
    res.json(trips.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get trips by driver
exports.getTripsByDriver = async (req, res) => {
    try {
      const trips = await db.query('SELECT * FROM trips WHERE driver_id = $1 ORDER BY start_time DESC', [req.params.id]);
      res.json(trips.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

// Get ongoing trips
exports.getOngoingTrips = async (req, res) => {
    try {
        const trips = await db.query('SELECT * FROM trips WHERE end_time IS NULL ORDER BY start_time DESC');
        res.json(trips.rows);
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
    let trip = await db.query('SELECT * FROM trips WHERE id = $1', [tripId]);
    if (trip.rows.length === 0) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Ensure the driver owns the trip
    if (trip.rows[0].driver_id !== req.driver.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updatedTrip = await db.query(
      'UPDATE trips SET destination = $1, cargo = $2, commission_type = $3 WHERE id = $4 RETURNING *',
      [destination, cargo, commission_type, tripId]
    );

    res.json(updatedTrip.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// End a trip
exports.endTrip = async (req, res) => {
    const tripId = req.params.id;
    try {
        let trip = await db.query('SELECT * FROM trips WHERE id = $1', [tripId]);
        if (trip.rows.length === 0) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        // Ensure the driver owns the trip
        if (trip.rows[0].driver_id !== req.driver.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if(trip.rows[0].end_time) {
            return res.status(400).json({ msg: 'Trip has already ended.' });
        }

        const endedTrip = await db.query(
            'UPDATE trips SET end_time = NOW() WHERE id = $1 RETURNING *',
            [tripId]
        );

        res.json(endedTrip.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    let trip = await db.query('SELECT * FROM trips WHERE id = $1', [tripId]);
    if (trip.rows.length === 0) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Ensure the driver owns the trip
    if (trip.rows[0].driver_id !== req.driver.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await db.query('DELETE FROM trips WHERE id = $1', [tripId]);

    res.json({ msg: 'Trip removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
