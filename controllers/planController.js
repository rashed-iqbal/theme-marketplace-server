const Joi = require("joi");
const PlanModel = require("../models/PlanModel");
const { StatusError } = require("../utils");
const UserStore = require("../models/UserStore");

// @desc    Create New Plan
// @route   POST /plans
// @access  Private
const createPlanSchema = Joi.object({
    userId: Joi.string().required(),
    planName: Joi.string().required(),
    planPrice: Joi.string().required(),
    downloadLimit: Joi.number().required(),
    planStart: Joi.date().required(),
    planEnd: Joi.date().required(),
    interval: Joi.string(),
    ads: Joi.boolean(),
    priceId: Joi.string(),
    isTrial: Joi.boolean(),
});

const createPlan = async (req, res) => {
    try {
        const { error, value } = createPlanSchema.validate(req.body);
        if (error) throw StatusError(error.message, 400);
        const plan = new PlanModel(value);
        await plan.save();

        const userStore = await UserStore.findOneAndUpdate(
            { userId: value.userId },
            { currentPlan: plan._id },
            { new: true }
        );

        if (!userStore) throw StatusError("User store not found !", 400);
        res.status(200).send({ message: "Plan created successfully", plan });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// @desc    Get Plan by id
// @route   GET /plans
// @access  Public

const getPlanById = async (req, res) => {
    const { id } = req.params;
    if (!id) throw StatusError("Required id not found", 400);
    const plan = await PlanModel.findOne({ _id: id });
    if (!plan) throw StatusError("Plan data not found");
    res.status(200).send(plan);
};

//get all plans
const getAllPlan = async (req, res) => {
    const plan = await PlanModel.find().populate("userId").sort({ _id: -1 });
    if (!plan) throw StatusError("Plan data not found");
    res.status(200).send(plan);
};

// @desc    Update Plan
// @route   PUT /plans/:id
// @access  Private

const updatePlanSchema = Joi.object({
    planName: Joi.string(),
    planPrice: Joi.string(),
    downloadLimit: Joi.number(),
    ads: Joi.boolean(),
    planStart: Joi.date(),
    planEnd: Joi.date(),
});

const updatePlan = async (req, res) => {
    const { id } = req.params;
    if (!id) throw StatusError("Required id not found");
    const { error, value } = updatePlanSchema.validate(req.body);
    if (error) throw StatusError(error.message, 400);
    const updatedPlan = await PlanModel.findOneAndUpdate({ _id: id }, value, {
        new: true,
    });
    res.status(200).send({ message: "Plan updated successfully", updatedPlan });
};

// @desc    Delete Plan
// @route   DELETE /plans/:id
// @access  Private
const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) throw StatusError("Required id not found", 400);
        const deletedPlan = await PlanModel.findOneAndDelete(
            { _id: id },
            { new: true }
        );
        res.status(200).send({
            message: "Plan deleted successfully !",
            deletedPlan,
        });
    } catch (err) {
        res.status(500).send({ err: message });
    }
};

module.exports = {
    createPlan,
    updatePlan,
    deletePlan,
    getPlanById,
    getAllPlan,
};
