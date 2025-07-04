const authService = require('../services/authService');
const Admin = require('../models/admin');
const { autoUpdateLeadStatuses } = require('../cron/statusUpdater');
const bcrypt = require('bcrypt');

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.loginAdmin(email, password);
    const admin = await Admin.findOne({ email });

    // Run status update after successful login
    await autoUpdateLeadStatuses();

    res.json({
      _id: admin._id,
      email: admin.email,
      token,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const sendOtpToAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    const message = await authService.sendOtpToAdmin(email);
    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const message = await authService.resetPasswordWithOtp(email, otp, newPassword);
    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


module.exports = { loginAdmin,sendOtpToAdmin,resetPasswordWithOtp};
