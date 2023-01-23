const mongoose = require("mongoose");

// Reply Schema
const commentReplySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        message: { type: String },
    },
    { timestamps: true }
);

// Main Schema
const productCommentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        text: { type: String, required: true },
        reply: [commentReplySchema],
    },
    { timestamps: true }
);

const ProductComment = mongoose.model("ProductComment", productCommentSchema);

module.exports = ProductComment;
