const db = require('../db/db');
const { validationResult } = require('express-validator');

// Get current driver's profile
exports.getDriver = async (req, res) => {
  try {
    // req.driver.id is from the authMiddleware
    const driver = await db.query('SELECT id, name, email, working_hours, created_at FROM drivers WHERE id = $1', [req.driver.id]);

    if (driver.rows.length === 0) {
      return res.status(404).json({ msg: 'Driver not found' });
    }

    res.json(driver.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update driver profile
exports.updateDriver = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, working_hours } = req.body;
  const driverId = req.driver.id;

  // Build driver object
  const driverFields = {};
  if (name) driverFields.name = name;
  if (working_hours) driverFields.working_hours = working_hours;

  try {
    // Check if driver exists
    let driver = await db.query('SELECT * FROM drivers WHERE id = $1', [driverId]);
    if (driver.rows.length === 0) {
      return res.status(404).json({ msg: 'Driver not found' });
    }

    // Update
    const updatedDriver = await db.query(
      'UPDATE drivers SET name = $1, working_hours = $2 WHERE id = $3 RETURNING id, name, email, working_hours',
      [
        driverFields.name || driver.rows[0].name,
        driverFields.working_hours || driver.rows[0].working_hours,
        driverId
      ]
    );

    res.json(updatedDriver.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete driver
exports.deleteDriver = async (req, res) => {
  try {
    const driverId = req.driver.id;
    // Check if driver exists
    let driver = await db.query('SELECT * FROM drivers WHERE id = $1', [driverId]);
    if (driver.rows.length === 0) {
      return res.status(404).json({ msg: 'Driver not found' });
    }

    // We can't delete a driver who has ongoing trips.
    // The trips table has ON DELETE SET NULL, but it's better to prevent this case.
    const ongoingTrips = await db.query('SELECT * FROM trips WHERE driver_id = $1 AND end_time IS NULL', [driverId]);
    if(ongoingTrips.rows.length > 0) {
        return res.status(400).json({ msg: 'Cannot delete driver with ongoing trips.' });
    }

    // Delete driver
    await db.query('DELETE FROM drivers WHERE id = $1', [driverId]);

    res.json({ msg: 'Driver deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
