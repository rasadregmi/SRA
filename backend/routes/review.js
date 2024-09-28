const express = require('express');
const router = express.Router();
const Review = require('../models/review');

// POST route to create a review
router.post('/', async (req, res) => {
   const { url, message, rating } = req.body;

   try {
      const newReview = new Review({
         url,
         message,
         rating
      });

      await newReview.save();
      res.status(201).json({ message: 'Review submitted successfully' });
   } catch (err) {
      res.status(500).json({ error: 'Failed to submit review' });
   }
});

module.exports = router;
