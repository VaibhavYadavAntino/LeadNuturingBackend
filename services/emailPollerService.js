const { fetchAndSaveEmails } = require('./gmailFetchService');

// Start email polling
async function startEmailPolling() {
  try {
    console.log('Starting email polling...');
    // Run immediately
    await fetchAndSaveEmails();
    console.log('Initial email fetch completed at', new Date().toLocaleString());
    
    // Then every 2 minutes
    setInterval(async () => {
      try {
        await fetchAndSaveEmails();
        console.log('Email fetch completed at', new Date().toLocaleString());
      } catch (err) {
        console.error('Error in email polling:', err);
      }
    }, 2 * 60 * 1000); // 2 minutes
  } catch (err) {
    console.error('Error starting email polling:', err);
  }
}

module.exports = {
  startEmailPolling
}; 