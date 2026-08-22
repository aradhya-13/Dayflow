require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const attendanceRoutes = require('./routes/attendance');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '5mb' })); // allow base64 profile pictures

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ success: true, message: 'Dayflow API running' }));

// 404 fallback
app.use((_, res) => res.status(404).json({ success: false, message: 'Route not found' }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
