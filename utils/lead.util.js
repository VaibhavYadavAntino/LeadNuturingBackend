function getLeadStatus(lastContactDate) {
  const now = new Date();
  const days = Math.floor((now - new Date(lastContactDate)) / (1000 * 60 * 60 * 24));

  if (days <= 60) return 'engaged';
  if (days > 60 && days <= 90) return 'dormant';
  if (days > 90) return 'unresponsive';
}

module.exports = { getLeadStatus };
