const mongoose = require("mongoose");

const userStoreSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        customerId: { type: String },

        currentPlan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
        },

        notifications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Notification",
            },
        ],

        wishList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        downloadProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "DownloadProduct",
            },
        ],
        freebieUse: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const UserStore = mongoose.model("UserStore", userStoreSchema);

module.exports = UserStore;
