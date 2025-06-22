const authService = require('../services/authService');
const Admin = require('../models/admin');

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.loginAdmin(email, password);
    const admin = await Admin.findOne({ email }); // To get admin details without password

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
