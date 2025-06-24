// cron/statusUpdater.js
const cron = require('node-cron');
const Lead = require('../models/Lead');

const autoUpdateLeadStatuses = async () => {
    console.log(`[${new Date().toLocaleTimeString()}]  Cron triggered`);
    console.log(`[${new Date().toLocaleTimeString()}]  Checking lead statuses...`);
  try {
    const leads = await Lead.find({});
    const now = new Date();
    let updatedCount = 0;

    for (const lead of leads) {
      const daysSinceContact = Math.floor((now - new Date(lead.lastContactDate)) / (1000 * 60 * 60 * 24));
      let newStatus = null;

      if (lead.status === 'engaged' && daysSinceContact > 30) {
        newStatus = 'dormant';
      } else if (lead.status === 'dormant' && daysSinceContact > 90) {
        newStatus = 'unresponsive';
      }

      if (newStatus) {
        lead.status = newStatus;
        await lead.save();
        updatedCount++;
      }
    }
    console.log(`[${new Date().toLocaleTimeString()}]Cron Job: Updated ${updatedCount} lead statuses`);

  } catch (err) {
    console.error('Cron Job Error:', err.message);
  }
};

//schedule to run every hour
const startCronJob = () => {
  cron.schedule('0 * * * *', autoUpdateLeadStatuses);
};

module.exports = startCronJob;
