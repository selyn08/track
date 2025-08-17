// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/drivers');
const tripRoutes = require('./routes/trips');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);

// Simple route for checking if the API is up
app.get('/', (req, res) => {
  res.send('Trucking API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
