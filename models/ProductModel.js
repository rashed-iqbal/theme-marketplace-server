const mongoose = require("mongoose");

// Main Schema
const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        categories: {
            type: [{ type: String }],
            default: undefined,
        },
        type: { type: String, required: true },
        isVisible: { type: Boolean, default: true },
        licenses: {
            personal: {
                pdf: String,
                price: String,
            },
            commercial: {
                pdf: String,
                price: String,
            },
            buyout: {
                pdf: String,
                price: String,
            },
        },
        ratings: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ProductRating",
                },
            ],
            default: undefined,
        },
        comments: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ProductComment",
                },
            ],
            default: undefined,
        },

        description: { type: String },
        features: {
            type: [
                {
                    _id: false,
                    heading: { type: String, required: true },
                    list: [String],
                },
            ],
            default: undefined,
        },

        services: {
            type: [
                {
                    _id: false,
                    text: { type: String, required: true },
                    price: { type: Number, required: true },
                },
            ],
            default: undefined,
        },

        liveLink: { type: String },
        softwares: {
            type: [{ type: String }],
            default: undefined,
        },

        files: {
            images: {
                type: [{ type: String }],
                default: undefined,
            },
            sourceFile: String,
            thumbnail: String,
        },
        tags: {
            type: [{ type: String }],
            default: undefined,
        },
        views: {
            type: Number,
            default: 0,
        },
        downloads: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
