const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
   url: {
      type: String,
      required: true,
   },
   message: {
      type: String,
      required: true,
   },
   rating: {
      type: Number,
      required: true,
   },
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

module.exports = Review;
