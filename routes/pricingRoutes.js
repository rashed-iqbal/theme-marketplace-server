const express = require("express");
const router = express.Router();

// Pricing Controllers
const {
    createPricing,
    getPricings,
    getPricing,
    updatePricing
} = require("../controllers/pricingController");


// Routes Prefix => "/pricings"

// Get pricings
router.route("/").get(getPricings).post(createPricing);

// Get single pricing & Update pricing
router.route("/:id").get(getPricing).put(updatePricing);

module.exports = router;
