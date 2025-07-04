const express = require('express');
const app = express();

app.use(express.json());

// Register webhook routes
const webhookRoutes = require('./routes/webhookRoutes');
app.use('/api/webhooks', webhookRoutes);

// Register communication routes
const communicationRoutes = require('./routes/communicationRoutes');
app.use('/api/communications', communicationRoutes);

// Optional: health check
app.get('/health', (req, res) => res.json({ status: 'UP' }));

// Start server if not in test mode
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
