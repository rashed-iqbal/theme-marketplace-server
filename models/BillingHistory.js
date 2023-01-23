const { Schema, model } = require("mongoose");

const billingHistorySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        downloadProduct: {
            type: Schema.Types.ObjectId,
            ref: "DownloadProduct",
        },
        invoice_no: {
            type: Number,
        },
        status: {
            type: String,
            default: "Completed",
        },
        amount: {
            type: Number,
        },
        plan: {
            type: Schema.Types.ObjectId,
            ref: "Plan",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("BillingHistory", billingHistorySchema);
