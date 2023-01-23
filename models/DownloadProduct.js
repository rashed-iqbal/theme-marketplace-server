const { Schema, model } = require("mongoose");

const downloadProductSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    license: {
        type: String,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    isDownloaded: {
        type: Boolean,
        default: false,
    },
    services: {
        type: [
            {
                _id: false,
                text: { type: String, required: true },
                price: { type: Number, required: true },
            },
        ],
    },
    support: {
        start: String,
        end: String,
        text: { type: String },
        price: { type: Number },
    },
});

module.exports = model("DownloadProduct", downloadProductSchema);
