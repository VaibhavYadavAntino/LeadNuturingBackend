function getLeadStatus(lastContactDate) {
  // Use India timezone (IST - UTC+5:30)
  const now = new Date();
  const lastContact = new Date(lastContactDate);
  
  // Convert to IST for accurate day calculation
  const istNow = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const istLastContact = new Date(lastContact.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  
  const days = Math.floor((istNow - istLastContact) / (1000 * 60 * 60 * 24));

  console.log(`[DEBUG] getLeadStatus: lastContactDate=${lastContactDate}, istLastContact=${istLastContact}, istNow=${istNow}, days=${days}`);

  if (days <= 60) return 'engaged';
  if (days > 60 && days <= 90) return 'dormant';
  if (days > 90) return 'unresponsive';
}

module.exports = { getLeadStatus };
