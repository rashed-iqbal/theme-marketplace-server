const STRIPE_SECRET_KEY =
    process.env.STRIPE_SECRET_KEY ||
    "sk_test_51LpbnJLpSmU6gOZ7GS4a1VxfIJn4XPJ4hYywTKRbcAhJCA5E7vlqRfQIv4hDiRZKqAjcJ96AQr1d2i87bzCJkgN200lDdW2FGs";
const stripe = require("stripe")(STRIPE_SECRET_KEY);
const Joi = require("joi");
const { UserModel } = require("../models/UserModel");
const { StatusError } = require("../utils");
const async = require("async");
const { EncryptData } = require("../utils/index");
const email = require("../utils/email");
const UserStoreModel = require("../models/UserStore");
const { HashPassword } = require("./authController");
const TokenModel = require("../models/Token");
const crypto = require("crypto");

const getCustomer = async (req, res) => {
    const { id } = req.params;
    if (!id) throw StatusError("Required id not found");
    const customer = await stripe.customers.retrieve(id);
    res.status(200).send(customer);
};

const getPaymentMethod = async (req, res) => {
    const { id } = req.params;
    if (!id) throw StatusError("Required is not found");
    const paymentMethods = await stripe.customers.listPaymentMethods(id, {
        type: "card",
    });
    if (!paymentMethods.data.length)
        throw StatusError("Payment method not found");
    res.status(200).send(paymentMethods.data[0]);
};

const detachPaymentMethod = async (req, res) => {
    const { id } = req.params;
    if (!id) throw StatusError("Required id not found");

    const paymentMethods = await stripe.customers.listPaymentMethods(id, {
        type: "card",
    });
    if (!paymentMethods.data.length)
        throw StatusError("Payment method not found");
    await async.each(paymentMethods.data, async (data) => {
        await stripe.paymentMethods.detach(data.id);
    });

    res.status(200).send({
        message: "Payment method deleted successfully",
    });
};

const createCustomerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
});

const createCustomer = async (req, res) => {
    const { error, value } = createCustomerSchema.validate(req.body);
    if (error) throw StatusError(error.message, 400);
    const customer = await stripe.customers.create({
        name: value.name,
        email: value.email,
    });
    res.status(200).send(customer);
};

const createSetupIntent = async (req, res) => {
    const { customer } = req.body;
    if (!customer) throw StatusError("Required customer id not found");
    const intent = await stripe.setupIntents.create({
        customer,
        payment_method_types: ["card"],
    });
    res.status(200).send(intent);
};

const createSubscriptionSchema = Joi.object({
    customer: Joi.string().required(),
    priceId: Joi.string().required(),
    paymentMethod: Joi.string().required(),
});

const createSubscription = async (req, res) => {
    const { error, value } = createSubscriptionSchema.validate(req.body);
    if (error) throw StatusError(error.message, 400);

    // const updateDate = new Date();
    // updateDate.setDate(updateDate.getDate() + value.trial);
    // const trial_end = value.trial && Math.round(updateDate.getTime() / 1000);

    const subscription = await stripe.subscriptions.create({
        customer: value.customer,
        items: [
            {
                price: value.priceId,
            },
        ],
        payment_behavior: "default_incomplete",
        default_payment_method: value.paymentMethod,
        expand: ["latest_invoice.payment_intent"],
    });
    res.status(200).send(subscription);
};

const getPriceData = async (req, res) => {
    const { id } = req.params;
    if (!id) throw StatusError("Required id not found");
    const price = await stripe.prices.retrieve(id, {
        expand: ["product"],
    });
    if (!price) throw StatusError("Price not found", 400);
    res.status(200).send(price);
};

const handleCheckCustomer = async (req, res) => {
    const { email, googleAuth } = req.body;
    if (!email) throw StatusError("Required email not found");

    const user = await UserModel.findOne({ email });

    if (user) {
        if (googleAuth && user.googleAuth) {
            return res.status(200).send({ success: true, login: true });
        }

        if (!googleAuth && user.googleAuth) {
            throw StatusError(
                "Your account is connected to Google. Please Continue with Google"
            );
        }

        if (googleAuth && !user.googleAuth) {
            throw StatusError(
                "Your account is already created with credential, please login with email and password",
                400
            );
        }

        if (!googleAuth && !user.googleAuth) {
            throw StatusError(
                "User already exist with this email, please login first"
            );
        }
    }

    res.status(200).send({ success: true });
};

const confirmCustomPaymentSchema = Joi.object({
    amount: Joi.number().required(),
    payment_method: Joi.string().required(),
    customer: Joi.string().required(),
});

const confirmCustomPayment = async (req, res) => {
    const value = await confirmCustomPaymentSchema.validateAsync(req.body);
    const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        payment_method_types: ["card"],
        confirm: true,
        ...value,
    });
    res.status(200).send(paymentIntent);
};

const createNewUserSchema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    confirm_password: Joi.string(),
    customer: Joi.string(),
    profile: Joi.string(),
});

const createNewUser = async (req, res) => {
    const { customer, password, ...value } =
        await createNewUserSchema.validateAsync(req.body);
    const user = new UserModel(value);
    const userStore = new UserStoreModel({ customerId: customer });

    if (password) {
        user.password = await HashPassword(password);
        const { token } = await new TokenModel({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const verifyEmailLink = `${process.env.BASE_URL}/users/${user._id}/verify/${token}`;
        await email.send({
            message: {
                to: user.email,
            },
            template: "confirm_email",
            locals: {
                url: verifyEmailLink,
                name: user.firstName,
            },
        });
    } else {
        user.googleAuth = true;
    }

    user.userStore = userStore._id;
    userStore.userId = user._id;

    await user.save();
    await userStore.save();

    const token = EncryptData({ id: user._id });

    res.status(200).send({ user, token });
};

module.exports = {
    createCustomer,
    createSetupIntent,
    createSubscription,
    getCustomer,
    getPaymentMethod,
    detachPaymentMethod,
    getPriceData,
    handleCheckCustomer,
    createNewUser,
    confirmCustomPayment,
};
