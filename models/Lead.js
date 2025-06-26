const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: {
    type: String,
    required: true,
    maxlength: 10,
  },
  lastContactDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['engaged', 'dormant', 'unresponsive'],
    default: 'engaged'
  },
  companyName: { type: String, required: true },
}, {
  timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;
