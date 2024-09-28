const mongoose = require('mongoose');

// Schema for Report
const reportSchema = new mongoose.Schema({
  reportingTo: { type: String, required: true },
  scamType: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  attachments: { type: String },
});

module.exports = mongoose.model('Report', reportSchema);
