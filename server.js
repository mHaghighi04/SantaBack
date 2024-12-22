const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
require('dotenv').config();

const morgan = require('morgan');

// Use morgan to log requests to the console
app.use(morgan('combined'));


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.options('*', cors());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or another email provider
  auth: {
    user: process.env.EMAIL_USER, // Email address from .env file
    pass: process.env.EMAIL_PASS, // App-specific password from .env file
  },
});

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

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
