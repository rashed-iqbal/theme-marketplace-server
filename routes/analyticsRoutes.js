const { handleAnalytics } = require("../controllers/handleAnalytics");

const router = require("express").Router();

router.get("/", handleAnalytics);

module.exports = router;
