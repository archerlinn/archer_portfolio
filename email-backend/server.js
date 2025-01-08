// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows requests from any origin by default
app.use(express.json()); // Parse JSON body

// Nodemailer transporter
// For demonstration, we'll use Gmail; adapt for your email provider
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'archerlin0530@gmail.com', // your Gmail address
    pass: 'orkt feze conf dvcz',      // ideally an App Password, not your personal password
  },
});

// Test endpoint (optional) to verify server is running
app.get('/', (req, res) => {
  res.send('Email Backend is up and running!');
});

/**
 * POST /send-email
 * Expect JSON body { name, email, message } from the front end
 */
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing name, email, or message.' });
  }

  // Configure mail options
  const mailOptions = {
    from: `"Portfolio Contact" <${email}>`, // user email in "from" field
    to: 'archerlin0530@gmail.com', // where you want to receive the messages
    subject: `New message from ${name}`,
    text: `
    Sender Name: ${name}
    Sender Email: ${email}
    
    Message:
    ${message}
    `,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Error sending email' });
    }
    console.log('Email sent:', info.response);
    return res.status(200).json({ message: 'Email sent successfully!' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
