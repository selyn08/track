const db = require('../db/db');
const { validationResult } = require('express-validator');

// Get current driver's profile
exports.getDriver = async (req, res) => {
  try {
    // req.driver.id is from the authMiddleware
    const driver = await db.get('SELECT id, name, email, working_hours, created_at FROM drivers WHERE id = ?', [req.driver.id]);

    if (!driver) {
      return res.status(404).json({ msg: 'Driver not found' });
    }

    res.json(driver);
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

  try {
    // Check if driver exists
    let driver = await db.get('SELECT * FROM drivers WHERE id = ?', [driverId]);
    if (!driver) {
      return res.status(404).json({ msg: 'Driver not found' });
    }

    // Build driver object
    const driverFields = {
        name: name || driver.name,
        working_hours: working_hours || driver.working_hours
    };

    // Update
    await db.run(
      'UPDATE drivers SET name = ?, working_hours = ? WHERE id = ?',
      [
        driverFields.name,
        driverFields.working_hours,
        driverId
      ]
    );

    const updatedDriver = await db.get('SELECT id, name, email, working_hours FROM drivers WHERE id = ?', [driverId]);

    res.json(updatedDriver);
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
    let driver = await db.get('SELECT * FROM drivers WHERE id = ?', [driverId]);
    if (!driver) {
      return res.status(404).json({ msg: 'Driver not found' });
    }

    // We can't delete a driver who has ongoing trips.
    const ongoingTrips = await db.all('SELECT * FROM trips WHERE driver_id = ? AND end_time IS NULL', [driverId]);
    if(ongoingTrips.length > 0) {
        return res.status(400).json({ msg: 'Cannot delete driver with ongoing trips.' });
    }

    // Delete driver
    await db.run('DELETE FROM drivers WHERE id = ?', [driverId]);

    res.json({ msg: 'Driver deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
