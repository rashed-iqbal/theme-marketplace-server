const Joi = require("joi");
const BillingHistory = require("../models/BillingHistory");
const { StatusError } = require("../utils");
const BillingTemplate = require("../templates/index");
const pdf = require("html-pdf");

exports.getBilling = async (req, res) => {
    const billingHistory = await BillingHistory.find()
        .populate({
            path: "downloadProduct",
            populate: {
                path: "productId",
            },
        })
        .populate("plan")
        .populate("userId")
        .sort({ createdAt: -1 })
        .exec();
    if (!billingHistory.length) throw StatusError("No billing found!", 404);
    res.status(200).send(billingHistory);
};

const createBillingSchema = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number(),
    plan: Joi.string(),
    downloadProduct: Joi.string(),
});

exports.createBilling = async (req, res) => {
    const { error, value } = createBillingSchema.validate(req.body);
    if (error) throw StatusError(error.message, 400);
    const invoice_no = getRandomInt(100000, 999999);
    const billing = new BillingHistory({ ...req.body, invoice_no });
    await billing.save();
    res.status(200).send({ message: "Billing history created successfully" });
};

exports.getUserBilling = async (req, res) => {
    const { userId } = req.params;
    if (!userId) throw StatusError("Required user_id not found", 400);
    const billing = await BillingHistory.find({ userId })
        .populate({
            path: "downloadProduct",
            populate: {
                path: "productId",
            },
        })
        .populate("plan")
        .populate("userId")
        .exec();
    if (!billing.length) throw StatusError("Billing history not found");
    res.status(200).send(billing);
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
