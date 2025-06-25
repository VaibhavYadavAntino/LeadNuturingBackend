const axios = require('axios');

const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
const token = process.env.ULTRAMSG_TOKEN;

async function sendWhatsApp(phone, message) {
  const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;
  try {
    const response = await axios.post(url, null, {
      params: {
        token: token,
        to: phone,
        body: message
      }
    });
    return response.data;
  } catch (error) {
    console.error('WhatsApp send error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { sendWhatsApp }; 