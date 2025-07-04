const transporter = require('../config/nodemailer');
const { google } = require('googleapis');
const fs = require('fs');

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
);

const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: `"Lead Nurturing App" <${process.env.EMAIL_USER}>`, // Sender address
    to: to, // List of receivers
    subject: subject, // Subject line
    html: htmlContent, // HTML body
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error };
  }
};

async function getGmailAccessToken() {
  if (fs.existsSync('token.json')) {
    const token = JSON.parse(fs.readFileSync('token.json'));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  } else {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    });
    throw new Error('Authorize this app by visiting this url: ' + authUrl);
  }
}

async function fetchRecentGmailMessages(maxResults = 5) {
  const auth = await getGmailAccessToken();
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({ userId: 'me', maxResults });
  const messages = res.data.messages || [];
  const results = [];
  for (const msg of messages) {
    const msgRes = await gmail.users.messages.get({ userId: 'me', id: msg.id });
    results.push({
      id: msg.id,
      snippet: msgRes.data.snippet,
      payload: msgRes.data.payload,
      full: msgRes.data
    });
  }
  return results;
}

module.exports = {
  sendEmail,
  fetchRecentGmailMessages,
}; 