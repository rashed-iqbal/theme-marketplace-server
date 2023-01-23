const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema(
  {
    pageHeading: { type: String, required: true },
    pageText: { type: String, required: true },
    navHeadings: [
      {
        title: { type: String },
      },
    ],
    articleLink: {
      link: { type: String },
      text: { type: String },
    },
    supportText: [
      {
        title: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Support = mongoose.model('Support', supportSchema);

module.exports = Support;
