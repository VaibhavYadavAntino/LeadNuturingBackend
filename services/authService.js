const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./messagingService');
const bcrypt=require('bcrypt')

const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    return jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '365d',
      }
    );
  } else {
    throw new Error('Invalid email or password');
  }
};

const sendOtpToAdmin = async (email) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error('Admin not found');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000; 

  admin.otp = otp;
  admin.otpExpiry = otpExpiry;
  await admin.save();

  const subject = 'Your OTP for Password Reset';
  const htmlContent = `
    <h3>Hello Admin,</h3>
    <p>Your OTP for password reset is: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes.</p>
    <br/>
    <p>Regards,<br/>Lead Nurturing App Team</p>
  `;

  await sendEmail(email, subject, htmlContent);

  return 'OTP sent successfully';
};

// Reset password using OTP
const resetPasswordWithOtp = async (email, otp, newPassword) => {
  const admin = await Admin.findOne({ email });

  if (!admin) {
    console.log("Admin not found");
    throw new Error('Invalid or expired OTP');
  }

  if (String(admin.otp) !== String(otp)) {
    console.log("OTP does not match");
    throw new Error('Invalid or expired OTP');
  }

  if (admin.otpExpiry < Date.now()) {
    console.log("OTP expired");
    throw new Error('Invalid or expired OTP');
  }

  console.log("OTP verified. Updating password...");

  admin.password = newPassword;
  admin.otp = undefined;
  admin.otpExpiry = undefined;
  await admin.save();

  return 'Password reset successful';
};


module.exports = {
  loginAdmin,sendOtpToAdmin,resetPasswordWithOtp
}; 