const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const uploadRoutes = require('./routes/upload.jsx');
const selectRoutes = require('./routes/select.jsx');
const updateRoutes = require('./routes/update.jsx');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
// Increase the limit for JSON payloads
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // This will parse JSON request bodies
app.use(bodyParser.json());

// Use the upload and select routes
app.use('/api', uploadRoutes);
app.use('/api', selectRoutes);
app.use('/api', updateRoutes)

app.post('/api/send-email', (req, res) => {
  const { recipient, subject, message } = req.body;
  console.log('Recipient:', recipient, 'Subject:', subject, 'Message:', message);

  // Set up Nodemailer transport using environment variables
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS 
    }
  });

  // Email options
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: subject,
    text: message
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send(error.toString());
    }
    console.log('Email sent:', info.response);
    res.send('Email sent: ' + info.response);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
