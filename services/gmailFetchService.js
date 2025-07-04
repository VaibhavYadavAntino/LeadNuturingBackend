const { google } = require('googleapis');
const fs = require('fs');
const Lead = require('../models/Lead');
const communicationService = require('./communicationService');
const Communication = require('../models/communication');

async function fetchAndSaveEmails() {
  // Load token from environment variables
  let token;
  try {
    // Try to load from environment variables first
    if (process.env.GMAIL_ACCESS_TOKEN && process.env.GMAIL_REFRESH_TOKEN) {
      token = {
        access_token: process.env.GMAIL_ACCESS_TOKEN,
        refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        scope: process.env.GMAIL_SCOPE || 'https://www.googleapis.com/auth/gmail.readonly',
        token_type: 'Bearer',
        expiry_date: process.env.GMAIL_EXPIRY_DATE ? parseInt(process.env.GMAIL_EXPIRY_DATE) : null
      };
    } else {
      // Fallback to token.json for development
      const tokenPath = 'token.json';
      token = JSON.parse(fs.readFileSync(tokenPath));
    }
  } catch (error) {
    console.error('Failed to load Gmail tokens:', error.message);
    throw new Error('Gmail tokens not found. Please check your environment variables or token.json file.');
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );
  oAuth2Client.setCredentials(token);

  // Listen for token refresh and log new token if refreshed
  oAuth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token || tokens.access_token) {
      const updatedToken = { ...token, ...tokens };
      console.log('Gmail token refreshed. New token details:', {
        access_token: tokens.access_token ? '***' : 'unchanged',
        refresh_token: tokens.refresh_token ? '***' : 'unchanged',
        expiry_date: tokens.expiry_date || 'unchanged'
      });
      
      // In production, you should update environment variables or secure storage
      // For now, we'll just log that tokens were refreshed
      if (process.env.NODE_ENV === 'production') {
        console.log('Token refreshed in production. Update your environment variables with the new tokens.');
      }
    }
  });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  let res;
  try {
    res = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 10, // Adjust as needed
    });
  } catch (err) {
    console.error('Failed to list messages:', err.message);
    throw err;
  }

  const messages = res.data.messages || [];
  for (const msg of messages) {
    // Deduplication: skip if already saved
    const existing = await Communication.findOne({ gmailMessageId: msg.id });
    if (existing) continue;

    let msgRes;
    try {
      msgRes = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full',
      });
    } catch (err) {
      console.error('Failed to fetch message:', msg.id, err.message);
      continue;
    }

    const payload = msgRes.data.payload;
    const headers = payload.headers;
    const from = headers.find(h => h.name === 'From')?.value;
    if (!from) continue;

    // Extract sender email (case-insensitive match)
    const senderEmail = (from.match(/<(.+)>/)?.[1] || from).trim().toLowerCase();

    // Check if sender exists in Lead collection (case-insensitive)
    const lead = await Lead.findOne({ email: { $regex: new RegExp('^' + senderEmail + '$', 'i') } });
    if (!lead) continue;

    // Extract subject, date, body
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const date = headers.find(h => h.name === 'Date')?.value;
    let body = '';

    // Helper to decode base64url
    function decodeBase64(str) {
      return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
    }

    // Try to get plain text part
    if (payload.parts) {
      const part = payload.parts.find(p => p.mimeType === 'text/plain');
      if (part && part.body && part.body.data) {
        body = decodeBase64(part.body.data);
      }
      // Fallback to HTML if no plain text
      if (!body) {
        const htmlPart = payload.parts.find(p => p.mimeType === 'text/html');
        if (htmlPart && htmlPart.body && htmlPart.body.data) {
          body = decodeBase64(htmlPart.body.data);
        }
      }
    } else if (payload.body && payload.body.data) {
      body = decodeBase64(payload.body.data);
    }

    // If still no body, skip saving
    if (!body) continue;

    // Save to communication log
    await communicationService.createCommunication({
      lead: lead._id,
      channel: 'email',
      message: body,
      timestamp: date ? new Date(date) : new Date(),
      direction: 'received',
      gmailMessageId: msg.id
    });
  }
}

module.exports = { fetchAndSaveEmails };
 