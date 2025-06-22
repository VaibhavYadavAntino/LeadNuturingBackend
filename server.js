require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const adminService = require('./services/adminService');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Create default admin
adminService.createDefaultAdmin(
  process.env.DEFAULT_ADMIN_EMAIL,
  process.env.DEFAULT_ADMIN_PASSWORD
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
