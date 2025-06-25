const authService = require('../services/authService');
const Admin = require('../models/admin');
const { autoUpdateLeadStatuses } = require('../cron/statusUpdater');

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

module.exports = { loginAdmin };
