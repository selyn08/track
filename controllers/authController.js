const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Register a new driver
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if driver already exists
    const driverExists = await db.get('SELECT * FROM drivers WHERE email = ?', [email]);
    if (driverExists) {
      return res.status(400).json({ msg: 'Driver already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Save driver to database
    const result = await db.run(
      'INSERT INTO drivers (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, password_hash]
    );

    // Get the new driver's data
    const newDriver = await db.get('SELECT id, name, email FROM drivers WHERE id = ?', [result.lastID]);

    res.status(201).json(newDriver);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login a driver
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if driver exists
    const driver = await db.get('SELECT * FROM drivers WHERE email = ?', [email]);
    if (!driver) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, driver.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create and sign JWT
    const payload = {
      driver: {
        id: driver.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
