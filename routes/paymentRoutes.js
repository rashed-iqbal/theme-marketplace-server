const router = require("express").Router();
const {
    createCustomer,
    createSetupIntent,
    getCustomer,
    getPaymentMethod,
    detachPaymentMethod,
    createSubscription,
    confirmCustomPayment,
    handleCheckCustomer,
    createNewUser,
    getPriceData,
} = require("../controllers/paymentController");

router.post("/customer", createCustomer);

router.post("/customer/check", handleCheckCustomer);

router.get("/customer/:id", getCustomer);

router
    .route("/customer/:id/payment-method")
    .get(getPaymentMethod)
    .delete(detachPaymentMethod);

router.post("/intent", createSetupIntent);

router.post("/subscription", createSubscription);

router.get("/subscription/price/:id", getPriceData);

router.post("/custom/confirm", confirmCustomPayment);

router.post("/users", createNewUser);

module.exports = router;
