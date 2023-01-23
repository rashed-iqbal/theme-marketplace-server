const mongoose = require("mongoose");

// Main Schema
const pricingSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        price: {
            annually: { type: Number },
            monthly: { type: Number },
        },

        features: [
            {
                _id: false,
                text: { type: String, required: true },
                isValid: { type: Boolean, required: true, default: true },
            },
        ],

        isTrial: { type: Boolean },
    },
    { timestamps: true }
);

const Pricing = mongoose.model("Pricing", pricingSchema);

module.exports = Pricing;
