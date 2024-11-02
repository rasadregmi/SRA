const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// POST request to submit report
router.post('/', async (req, res) => {
  try {
    const { reportingTo, scamType, description, email, attachments } = req.body;

    const newReport = new Report({
      reportingTo,
      scamType,
      description,
      email,
      attachments,
    });

    await newReport.save();
    res.status(200).json({ message: 'Report saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving report', error });
  }
});

module.exports = router;
