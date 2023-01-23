const { StatusError } = require("../utils");
const Joi = require("joi");
const UserStore = require("../models/UserStore");
const DownloadProduct = require("../models/DownloadProduct");

const createUserStoreSchema = Joi.object({
    userId: Joi.string().required(),
    customerId: Joi.string().required(),
    currentPlan: Joi.string(),
    notifications: Joi.array(),
    wishList: Joi.array(),
    downloadProducts: Joi.array(),
});

const updateUserStoreSchema = Joi.object({
    currentPlan: Joi.string(),
    notifications: Joi.array(),
    wishList: Joi.array(),
    downloadProducts: Joi.array(),
    freebieUse: Joi.boolean(),
});

// create user store
async function CreateUserStore(req, res) {
    const value = await createUserStoreSchema.validateAsync(req.body);
    const newUserStore = new UserStore(value);
    await newUserStore.save();
    res.status(200).send({ message: "User store created successfully" });
}

async function updateUserStore(req, res) {
    const { id } = req.params;
    if (!id) throw StatusError("Required id not found", 401);
    const value = await updateUserStoreSchema.validateAsync(req.body);
    const updateStore = await UserStore.findOneAndUpdate({ _id: id }, value, {
        new: true,
    });

    if (!updateStore) throw StatusError("User store updated successfully", 401);
    res.status(200).send({ message: "User store updated successfully" });
}

// Get downloads product
async function getDownloadProduct(req, res) {
    const { userId } = req.params;
    if (!userId) throw StatusError("Required user id not found", 400);

    const downloadedProduct = await DownloadProduct.find({ userId })
        .populate({
            path: "productId",
            populate: {
                path: "ratings",
            },
        })
        .exec();

    if (!downloadedProduct.length)
        throw StatusError("Download products not found", 400);

    res.status(200).send(downloadedProduct);
}

// Get user store
async function GetUserStore(req, res) {
    try {
        const userId = req.params.id;
        if (!userId) throw StatusError("Required user id not found !", 400);
        const userStore = await UserStore.find({ userId: userId });

        if (!userStore) throw StatusError("Store not found", 404);
        res.status(200).send(userStore);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

///Get all user store
const getAllUserStore = async (req, res) => {
    const userStore = await UserStore.find()
        .populate("currentPlan")
        .populate("userId")
        .sort({ createdAt: -1 })
        .exec();
    // .populate("wishList");
    if (!userStore) throw StatusError("User store not found");
    res.status(200).send(userStore);
};

// get user wish list
const getUserWishlist = async (req, res) => {
    const userId = req.params.id;
    const userStore = await UserStore.find({ userId: userId })
        .populate("currentPlan")
        .populate("userId")
        .populate({ path: "wishList", populate: { path: "ratings" } });
    // .populate("wishList");
    if (!userStore) throw StatusError("User store not found");
    res.status(200).send(userStore);
};

const addToWishSchema = Joi.object({
    productId: Joi.string().required(),
});

//
async function addToWishlist(req, res) {
    const userStoreId = req.params.id;
    if (!userStoreId)
        throw StatusError("Required userStoreId is not found", 401);

    const { productId } = await addToWishSchema.validateAsync(req.body);

    const userStore = await UserStore.findOneAndUpdate(
        { _id: userStoreId },
        { $addToSet: { wishList: productId } },
        { new: true }
    );
    if (!userStore) throw StatusError("UserStore not found");
    res.status(200).send({ message: "Wishlist add successfully" });
}

async function deleteFromWishlist(req, res) {
    const userStoreId = req.params.id;
    if (!userStoreId)
        throw StatusError("Required userStoreId is not found", 401);

    const { productId } = await addToWishSchema.validateAsync(req.body);

    const userStore = await UserStore.findOneAndUpdate(
        { _id: userStoreId },
        { $pull: { wishList: productId } },
        { new: true }
    );
    if (!userStore) throw StatusError("UserStore not found");
    res.status(200).send({ message: "Wishlist Remove successfully" });
}

async function getWishlist(req, res) {
    const userStoreId = req.params.id;
    if (!userStoreId)
        throw StatusError("Required userStoreId is not found", 401);

    const userStore = await UserStore.findOne({ _id: userStoreId })
        .populate({
            path: "wishList",
            populate: { path: "ratings" },
        })
        .exec();

    if (!userStore) throw StatusError("UserStore not found");
    if (!userStore.wishList) throw StatusError("Wishlist not found");
    if (!userStore.wishList.length) throw StatusError("Wishlist is Empty");

    res.status(200).send(userStore.wishList);
}

module.exports = {
    CreateUserStore,
    GetUserStore,
    updateUserStore,
    addToWishlist,
    getAllUserStore,
    deleteFromWishlist,
    getWishlist,
    getUserWishlist,
    getDownloadProduct,
};
