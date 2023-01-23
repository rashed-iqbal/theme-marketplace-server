const express = require("express");
const router = express.Router();
const { handleContactUs } = require("../controllers/handleContactUs");

router.post("/", handleContactUs);

module.exports = router;
