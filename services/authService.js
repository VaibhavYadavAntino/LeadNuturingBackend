const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

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

module.exports = {
  loginAdmin,
}; 