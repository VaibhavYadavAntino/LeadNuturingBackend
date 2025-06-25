function getLeadStatus(lastContactDate) {
  const now = new Date();
  const days = Math.floor((now - new Date(lastContactDate)) / (1000 * 60 * 60 * 24));
  if (days > 90) return 'unresponsive';
  if (days > 30) return 'dormant';
  return 'engaged';
}

module.exports = { getLeadStatus }; 