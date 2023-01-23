const express = require("express");
const router = express.Router();

const {
    updateRating,
    getRating,
    createRating,
    getRatingForHome,
} = require("../controllers/ratingController");

// Routes Prefix => "/ratings"

//get rating
router.get("/", getRating);

router.get("/home", getRatingForHome);

// Update & Delete rating
router.route("/:id").post(createRating).put(updateRating);

module.exports = router;
