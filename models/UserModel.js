const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { StatusError } = require("../utils/index");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String },
        profile: { type: String },
        verified: { type: Boolean },
        userStore: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserStore",
        },
        googleAuth: {
            type: Boolean,
        },
        status: {
            type: String,
            default: "inactive",
        },
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

const signupValidate = async (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity()
            .label("Password")
            .required()
            .error(
                StatusError(
                    "Your password must be at least 8 characters long, contain a mixture of number,symbol,uppercase and lowercase letters.",
                    400
                )
            ),
        verified: Joi.boolean().required(),
    });
    return await schema.validateAsync(data);
};

const signinValidate = async (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity()
            .label("Password")
            .required()
            .error(
                StatusError(
                    "Your password must be at least 8 characters long, contain a mixture of number,symbol,uppercase and lowercase letters.",
                    400
                )
            ),
    });
    return await schema.validateAsync(data);
};

const googleSigninValidate = async (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        profile: Joi.string().label("Profile Image"),
    });
    return await schema.validateAsync(data);
};

//update user schema
const updateUserValidate = async (data) => {
    const schema = Joi.object({
        firstName: Joi.string().label("Full Name"),
        lastName: Joi.string().label("Last Name"),
        email: Joi.string().email().label("Email"),
        status: Joi.string(),
        profile: Joi.string(),
    });
    return await schema.validateAsync(data);
};

// change user password schema
const changePasswordValidate = async (data) => {
    const schema = Joi.object({
        old_password: Joi.string().required(),
        new_password: passwordComplexity()
            .required()
            .label("Password")
            .error(
                StatusError(
                    "Your password must be at least 8 characters long, contain a mixture of number,symbol,uppercase and lowercase letters.",
                    400
                )
            ),
    });
    return await schema.validateAsync(data);
};

const singleUserValidate = async (data) => {
    const schema = Joi.object({
        _id: Joi.string(),
        email: Joi.string(),
    }).min(1);
    return await schema.validateAsync(data);
};

module.exports = {
    UserModel,
    signupValidate,
    signinValidate,
    googleSigninValidate,
    singleUserValidate,
    updateUserValidate,
    changePasswordValidate,
};
