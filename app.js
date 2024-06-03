const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Membuat pool koneksi
const pool = mysql.createPool({
    socketPath: process.env.INSTANCE_UNIX_SOCKET,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Handle parsing JSON content
app.use(express.json());

// ROUTES
// Get all bookings
app.get('/bookings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new booking
app.post('/bookings', async (req, res) => {
  const { schedule_id, name, email, phone, seats } = req.body;
  try {
    await pool.query('INSERT INTO bookings (schedule_id, name, email, phone, seats) VALUES (?, ?, ?, ?, ?)', [schedule_id, name, email, phone, seats]);
    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all films
app.get('/films', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM films');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all schedules
app.get('/schedules', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM schedules');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
