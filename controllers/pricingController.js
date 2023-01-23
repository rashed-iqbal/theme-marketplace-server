const Pricing = require("../models/PricingModel");
const joi = require("joi");
const { StatusError } = require("../utils");

// Pricing add validation
const validatePricing = joi.object({
    title: joi.string().required(),
    price: joi.object({
        annually: joi.number(),
        monthly: joi.number(),
    }),
    features: joi.array().items(
        joi.object({
            text: joi.string().required(),
            isValid: joi.boolean().required(),
        })
    ),
    isTrial: joi.boolean(),
});

// Pricing update validation
const validateUpdatePricing = joi.object({
    title: joi.string(),
    price: joi.object({
        annually: joi.number(),
        monthly: joi.number(),
    }),
    features: joi.array().items(
        joi.object({
            text: joi.string(),
            isValid: joi.boolean(),
        })
    ),
    isTrial: joi.boolean(),
});

// @desc    Create New Pricing.
// @route   POST /pricings
// @access  Private
const createPricing = async (req, res) => {
    const { error, value } = validatePricing.validate(req.body);
    if (error) throw StatusError(error.message, 400);

    const pricing = new Pricing(value);
    await pricing.save();
    res.status(201).send({ message: "Pricing added successfully" });
};

// @desc    Get All Pricings
// @route   GET /pricings
// @access  Public
const getPricings = async (req, res) => {
    const pricings = await Pricing.find();
    if (!pricings.length) throw StatusError("No pricings found!", 404);
    res.status(200).send(pricings);
};

// @desc    Get Single Pricing
// @route   GET /pricings/:id
// @access  Public
const getPricing = async (req, res) => {
    const pricing = await Pricing.findById(req.params.id);
    if (!pricing) throw StatusError("Pricing not found!", 404);
    res.status(200).send(pricing);
};

// @desc    Update Pricing
// @route   PUT /pricings/:id
// @access  Private
const updatePricing = async (req, res) => {
    // Check pricing exists
    const pricingId = req.params.id;
    if (!pricingId) throw StatusError("Pricing id not found!", 404);

    // Update Validation
    const { error, value } = validateUpdatePricing.validate(req.body);
    if (error) throw StatusError(error.message, 400);

    // Update
    const updatePricing = await Pricing.findOneAndUpdate(
        { _id: pricingId },
        {
            $set: {
                title: value.title,
                isTrial: value.isTrial,
                price: value.price,
                features: value.features,
            },
            // $push: { features: value.features },
        },

        {
            new: true,
        }
    );
    if (!updatePricing) throw StatusError("Pricing not found!", 404);
    res.status(200).send({
        message: "Pricing updated successfully",
        updatePricing,
    });
};

module.exports = {
    createPricing,
    getPricings,
    getPricing,
    updatePricing,
};
