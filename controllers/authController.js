const bcrypt = require("bcrypt");
const {
    UserModel,
    signupValidate,
    signinValidate,
    googleSigninValidate,
} = require("../models/UserModel");
const TokenModel = require("../models/Token");
const crypto = require("crypto");
const { StatusError, EncryptData } = require("../utils");
const email = require("../utils/email");
const UserStore = require("../models/UserStore");

const stripe = require("../utils/stripe");

const handleSignin = async (req, res) => {
    // validate body
    const value = await signinValidate(req.body);
    // check user
    const user = await UserModel.findOne({ email: value.email });
    if (!user) throw StatusError("Invalid credential", 401);
    // check google auth
    if (user.googleAuth)
        throw StatusError(
            "Your account is connected to Google. Please Continue with Google",
            403
        );
    // check password
    const isMatch = await MatchPassword(value.password, user.password);
    if (!isMatch) throw StatusError("Invalid credential", 401);

    if (!user.verified) {
        throw StatusError(
            "Your account isn't verified yet, Please verify",
            403
        );
    }
    const token = EncryptData({ id: user._id });
    res.status(200).send({
        token,
        user,
        message: "logged in successfully",
    });
};

const handleSignup = async (req, res) => {
    // validate body
    const value = await signupValidate(req.body);
    // check user
    let user = await UserModel.findOne({ email: value.email });
    if (user)
        throw StatusError(
            user.googleAuth
                ? "Your account is connected to Google. Please Continue with Google"
                : "User already exist"
        );

    // hash password
    value.password = await HashPassword(value.password);
    // save user
    user = await new UserModel(value).save();
    // create and save token
    const { token } = await new TokenModel({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
    }).save();
    // send email
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
    // send response
    res.status(200).send({
        message: "An Email has been send to your account please verify",
    });
};

const handleVerifyEmail = async (req, res) => {
    const { id, token } = req.params;
    if (!id || !token) throw StatusError("Required params not found");

    const isToken = await TokenModel.findOneAndDelete(
        { token, userId: id },
        { new: true }
    );
    if (!isToken) throw StatusError("Invalid Link");

    const user = await UserModel.findOne({ _id: id });
    if (!user) throw StatusError("Invalid Link");

    if (!user.userStore) {
        // task - create stripe customer and create user store
        const customer = await stripe.customers.create({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
        });

        const userStore = new UserStore({
            userId: user._id,
            customerId: customer.id || "2rhk2h3rhwofgosidofjw", // fake customer id
        });

        await UserModel.findOneAndUpdate(
            { _id: id },
            { verified: true, userStore: userStore._id },
            { new: true }
        );

        await userStore.save();
    } else {
        await UserModel.findOneAndUpdate(
            { _id: id },
            { verified: true },
            { new: true }
        );
    }

    res.status(200).send({ message: "Email verified successfully" });
};

const handleGoogleSignin = async (req, res) => {
    const value = await googleSigninValidate(req.body);
    let user = await UserModel.findOne({ email: value.email });
    if (user && !user.googleAuth) {
        throw StatusError(
            "Your account is created with credential. Please login with email and password"
        );
    }
    if (!user) {
        user = new UserModel({ googleAuth: true, ...value });

        const customer = await stripe.customers.create({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
        });

        const userStore = new UserStore({
            userId: user._id,
            customerId: customer.id || "2rhk2h3rhwofgosidofjw", // fake customer id
        });
        user.userStore = userStore._id;
        await user.save();
        await userStore.save();
    }

    const token = EncryptData({ id: user._id });

    res.status(200).send({
        token,
        message: "Google logged in successfully",
    });
};

const forgotPasswordRequest = async (req, res) => {
    const { email: inputEmail } = req.body;
    if (!inputEmail) throw StatusError("Required email not found", 400);

    const checkUser = await UserModel.findOne({ email: inputEmail });
    if (!checkUser) throw StatusError("User not found", 404);

    if (checkUser.googleAuth) {
        throw StatusError(
            "Your account is connected to Google. Please Continue with Google"
        );
    }

    // Resend Email Link
    let token = await TokenModel.findOne({ userId: checkUser._id });

    if (token) {
        if (new Date() - new Date(token.createdAt) < 60000) {
            throw StatusError(
                "Can't send reset password request within one minute",
                403
            );
        }
        await token.updateOne({ createdAt: new Date() });
    } else {
        token = await TokenModel.create({
            userId: checkUser._id,
            token: crypto.randomBytes(32).toString("hex"),
        });
    }

    const resetPassLink = `${process.env.BASE_URL}/password-reset/${token.token}`;

    // Send Reset Password Mail
    await email.send({
        message: {
            to: inputEmail,
        },
        template: "reset_password",
        locals: {
            name: checkUser.firstName,
            url: resetPassLink,
        },
    });

    res.status(200).send({
        message:
            "Reset password request send successfully, Please check your email",
    });
};

const handleResetPassword = async (req, res) => {
    let { password, token } = req.body;
    if (!token || !password) throw StatusError("Required data not found", 400);

    const checkToken = await TokenModel.findOne({ token });
    if (!checkToken) throw StatusError("Invalid token", 404);

    password = await HashPassword(password);

    await UserModel.updateOne({ _id: checkToken.userId }, { password });
    await TokenModel.deleteOne({ token });

    res.status(200).send({
        message: "Password reset successfully",
    });
};

const handleResendEmail = async (req, res) => {
    const { email: inputEmail } = req.body;

    if (!inputEmail) throw StatusError("Required email not found", 400);

    const user = await UserModel.findOne({
        email: inputEmail,
        verified: false,
    });

    if (!user) throw StatusError("This account already verified", 400);

    let token = await TokenModel.findOne({ userId: user._id });

    if (!token) {
        token = await new TokenModel({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
    }

    const verifyEmailLink = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;

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

    res.status(200).send("Email sent successfully!");
};

const HashPassword = async (password) => {
    return await bcrypt.hash(password, Number(process.env.SALT) || 10);
};

const MatchPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = {
    handleSignin,
    handleSignup,
    handleGoogleSignin,
    handleVerifyEmail,
    forgotPasswordRequest,
    handleResetPassword,
    handleResendEmail,
    HashPassword,
    MatchPassword,
};
