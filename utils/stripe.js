const STRIPE_SECRET_KEY =
    process.env.STRIPE_SECRET_KEY ||
    "sk_test_51LpbnJLpSmU6gOZ7GS4a1VxfIJn4XPJ4hYywTKRbcAhJCA5E7vlqRfQIv4hDiRZKqAjcJ96AQr1d2i87bzCJkgN200lDdW2FGs";
const stripe = require("stripe")(STRIPE_SECRET_KEY);
module.exports = stripe;
