function getLeadStatus(lastContactDate) {
  const now = new Date();
  const lastContact = new Date(lastContactDate);
  
  // Calculate days difference using UTC to avoid timezone issues
  const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const utcLastContact = Date.UTC(lastContact.getFullYear(), lastContact.getMonth(), lastContact.getDate());
  const days = Math.floor((utcNow - utcLastContact) / (1000 * 60 * 60 * 24));

  console.log(`[DEBUG] getLeadStatus: lastContactDate=${lastContactDate}, lastContact=${lastContact}, now=${now}, days=${days}`);

  if (days <= 60) return 'engaged';
  if (days > 60 && days <= 90) return 'dormant';
  if (days > 90) return 'unresponsive';
}

module.exports = { getLeadStatus };
