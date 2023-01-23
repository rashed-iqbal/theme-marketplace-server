const Notification = require("../models/NotificationModel");
const joi = require("joi");
const { StatusError } = require("../utils");
const UserStore = require("../models/UserStore");

// Notification validation
const validateNotify = joi.object({
    userId: joi.string().required(),
    title: joi.string().required(),
    description: joi.string().required(),
});

// @desc    Create Notification
// @route   POST /notifications
// @access  Private
const createNotification = async (req, res) => {
    const { error, value } = validateNotify.validate(req.body);
    const storeId = req.query.id;

    if (error) throw StatusError(error.message, 400);

    const notification = new Notification({
        userId: value.userId, // Static for now
        title: value.title,
        description: value.description,
    });

    const store = await UserStore.findOneAndUpdate(
        { _id: storeId },
        { $push: { notifications: notification._id } },
        { new: true }
    );
    if (!store) throw StatusError("User store  not found", 400);

    await notification.save();
    res.status(201).send({ message: "Notification  added", notification });
};

// @desc    Get Notifications
// @route   GET /notifications
// @access  Private
const getNotification = async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await Notification.find({ userId });
        if (!notifications.length)
            throw StatusError("Notification not found!", 404);
        res.status(200).send(notifications);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = { createNotification, getNotification };
