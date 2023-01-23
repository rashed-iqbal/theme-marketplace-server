const {
    CreateUserStore,
    GetUserStore,
    updateUserStore,
    addToWishlist,
    getAllUserStore,
    deleteFromWishlist,
    getWishlist,
    getUserWishlist,
    getDownloadProduct,
} = require("../controllers/userStoreController");

const router = require("express").Router();

// create user store
router.post("/", CreateUserStore);

// update user store
router.put("/:id", updateUserStore);

// get user store
router.get("/:id", GetUserStore);

// get user wish list
router.get("/wishlist/:id", getUserWishlist);

// get all users store
router.get("/", getAllUserStore);

//
router.get("/:id/wishlist", getWishlist);

// add wishlist
router.put("/:id/wishlist", addToWishlist);

// remove wishlist
router.delete("/:id/wishlist", deleteFromWishlist);

// get downloads product
router.get("/:userId/downloads", getDownloadProduct);

module.exports = router;
