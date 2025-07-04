require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const adminService = require('./services/adminService');
const { startCronJob } = require('./cron/statusUpdater');
const recentActivityRoutes = require('./routes/recentActivityRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const { startEmailPolling } = require('./services/emailPollerService');

const app = express();

// Connect to database
connectDB();

//push

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/communications', communicationRoutes);
app.use('/api/recent-activity', recentActivityRoutes);
app.use('/api/webhooks', webhookRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'API is working fine!' });
});

// Create default admin
adminService.createDefaultAdmin(
  process.env.DEFAULT_ADMIN_EMAIL,
  process.env.DEFAULT_ADMIN_PASSWORD
);

startCronJob();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start email polling after server starts
  startEmailPolling();
  console.log('Email fetch completed at', new Date().toLocaleString(), '- Timer-based fetch');
});
