const {
    UserModel,
    singleUserValidate,
    updateUserValidate,
    changePasswordValidate,
} = require("../models/UserModel");
const { StatusError } = require("../utils");
const { MatchPassword, HashPassword } = require("./authController");

async function getAllUsers(req, res) {
    const users = await UserModel.find();
    if (!users.length) throw StatusError("Users not found", 400);
    res.status(200).send(users);
}

async function getSingleUser(req, res) {
    const value = await singleUserValidate(req.query);
    const user = await UserModel.findOne(value);
    if (!user) throw StatusError("User not found", 404);
    const { password, __v, verified, createdAt, updatedAt, ...rest } =
        user._doc;

    res.status(200).send({ ...rest });
}
async function getUserWithStore(req, res) {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id })
        .populate({
            path: "userStore",
            populate: { path: "currentPlan" },
        })
        .exec();
    if (!user) throw StatusError("User not found", 404);
    const { password, __v, verified, createdAt, updatedAt, ...rest } =
        user._doc;

    res.status(200).send({ ...rest });
}

async function handleUpdateUser(req, res) {
    const { id } = req.params;
    if (!id) throw StatusError("Required id not found", 400);

    const value = await updateUserValidate(req.body);

    const updatedUser = await UserModel.findOneAndUpdate({ _id: id }, value, {
        new: true,
    });

    if (!updatedUser) throw StatusError("User not found");

    res.status(200).send({
        message: "User updated successfully",
    });
}

async function handlePasswordChange(req, res) {
    const { id } = req.params;
    if (!id) throw StatusError("Required id not found!");

    const { old_password, new_password } = await changePasswordValidate(
        req.body
    );

    const findUser = await UserModel.findOne({ _id: id });
    if (!findUser) throw StatusError("User not found", 404);

    const checkPassword = await MatchPassword(old_password, findUser.password);

    if (!checkPassword) {
        throw StatusError("Your previous password does not match", 403);
    }

    const newPassword = await HashPassword(new_password);

    await UserModel.updateOne({ _id: id }, { password: newPassword });

    res.status(200).send({
        success: true,
        message: "Password change successfully",
    });
}

async function handleDeleteUser(req, res) {
    const { id } = req.params;
    try {
        const findUser = await UserModel.findOne({ _id: id });
        if (!findUser) throw StatusError("User not found", 404);
        await UserModel.deleteOne(findUser);
    } catch (error) {
        res.status(error.status || 500).send("Failed to delete user!");
    }
}
module.exports = {
    getAllUsers,
    getSingleUser,
    handleDeleteUser,
    handlePasswordChange,
    handleUpdateUser,
    getUserWithStore,
};
