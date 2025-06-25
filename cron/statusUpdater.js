// cron/statusUpdater.js
const cron = require('node-cron');
const Lead = require('../models/Lead');
const RecentActivity = require('../models/RecentActivity');

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
      let oldStatus = lead.status;

      if (lead.status === 'engaged' && daysSinceContact > 30) {
        newStatus = 'dormant';
      } else if (lead.status === 'dormant' && daysSinceContact > 90) {
        newStatus = 'unresponsive';
      }

      if (newStatus) {
        lead.status = newStatus;
        await lead.save();
        updatedCount++;
        // Log the status change in RecentActivity
        await RecentActivity.create({
          type: 'status_update',
          lead: lead._id,
          info: `Status changed from ${oldStatus} to ${newStatus}`,
          timestamp: new Date(),
          statusAtActivity: oldStatus
        });
      }
    }
    console.log(`[${new Date().toLocaleTimeString()}]Cron Job: Updated ${updatedCount} lead statuses`);

  } catch (err) {
    console.error('Cron Job Error:', err.message);
  }
};

// Schedule to run once daily at midnight
const startCronJob = () => {
  cron.schedule('0 0 * * *', autoUpdateLeadStatuses);
};

module.exports = { startCronJob, autoUpdateLeadStatuses };
