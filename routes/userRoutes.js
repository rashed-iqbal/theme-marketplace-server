const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getSingleUser,
    handleDeleteUser,
    handlePasswordChange,
    handleUpdateUser,
    getUserWithStore,
} = require("../controllers/usersController");

//get all user
router.get("/all-user", getAllUsers);

//get user by user id or email
router.get("/", getSingleUser);

// get user with userstore
router.get("/:id", getUserWithStore);

//updata user by _id
router.put("/:id", handleUpdateUser);

//change password
router.put("/change-password/:id", handlePasswordChange);

//delete user
router.delete("/:id", handleDeleteUser);

module.exports = router;
