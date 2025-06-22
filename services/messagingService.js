const transporter = require('../config/nodemailer');

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

module.exports = {
  sendEmail,
}; 