const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { startScheduler } = require('./services/scheduler');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database connection
const connectDB = require('./config/db');
connectDB();

// Start post scheduler
startScheduler();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/linkedin', require('./routes/linkedin'));
app.use('/api/ai', require('./routes/ai'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'AI Social Media Manager API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});