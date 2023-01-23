const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        planName: { type: String, required: true },
        planPrice: { type: Number, required: true },
        ads: { type: Boolean },
        interval: { type: String },
        downloadLimit: { type: Number },
        planStart: { type: Date },
        planEnd: { type: Date },
        priceId: { type: mongoose.Schema.Types.ObjectId, ref: "Pricing" },
        isTrial: {
            type: Boolean,
        },
    },
    { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
