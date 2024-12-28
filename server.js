const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const morgan = require('morgan');
const mysql = require('mysql2');

// Load environment variables
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.options('*', cors());
app.use(morgan('combined'));

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost', // Replace with your DB host
  user: 'root',      // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'names_app', // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err.message);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or another email provider
  auth: {
    user: process.env.EMAIL_USER, // Email address from .env file
    pass: process.env.EMAIL_PASS, // App-specific password from .env file
  },
});

// Secret Santa Email Sending
app.post('/assign', async (req, res) => {
  const assignments = req.body;

  try {
    // Map assignments to promises and await their completion
    await Promise.all(
      assignments.map(({ giver, receiver, email }) => {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Your Secret Santa Assignment 🎅',
          text: `Hi ${giver}, you are the Secret Santa for ${receiver}! 🎁`,
        };

        // Send email
        return transporter.sendMail(mailOptions);
      })
    );

    res.status(200).send('Emails sent successfully!');
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send('Failed to send emails. Please try again.');
  }
});

// Add a new name to the database
app.post('/api/names', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const query = 'INSERT INTO names (name) VALUES (?)';
  db.query(query, [name], (err, results) => {
    if (err) {
      console.error('Error saving name:', err.message);
      return res.status(500).json({ error: 'Failed to save name' });
    }

    res.status(201).json({ id: results.insertId, message: 'Name saved successfully' });
  });
});

// Retrieve all names from the database
app.get('/api/names', (req, res) => {
  const query = 'SELECT * FROM names ORDER BY created_at DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching names:', err.message);
      return res.status(500).json({ error: 'Failed to fetch names' });
    }

    res.json(results);
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
