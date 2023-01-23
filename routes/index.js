const express = require("express");
const router = express.Router();

// Home Route
router.get("/", (req, res) => {
    res.json("Home Route");
});

// Other Routes
router.use("/plans", require("./planRoutes"));
router.use("/products", require("./productRoutes"));
router.use("/ratings", require("./ratingRoutes"));
router.use("/payments", require("./paymentRoutes"));
router.use("/supports", require("./supportRoutes"));
router.use("/notifications", require("./notifyRoutes"));
router.use("/bucket-store", require("./bucketStoreRoute"));
router.use("/pricings", require("./pricingRoutes"));
router.use("/user-store", require("./userStoreRoutes"));

router.use("/billing", require("./billingRoutes"));

router.use("/users", require("./userRoutes"));
router.use("/contact-us", require("./contactUs"));

router.use("/playground", require("./playgroundRoutes"));

router.use("/auth", require("./authRoutes"));

router.use("/files", require("./fileRoutes"));
router.use("/analytics", require("./analyticsRoutes"));

module.exports = router;
