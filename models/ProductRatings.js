const mongoose = require('mongoose');

const productRatingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

const ProductRating = mongoose.model('ProductRating', productRatingSchema);

module.exports = ProductRating;
