const express = require("express");
const router = express.Router();

const {
    createPlan,
    getPlanById,
    updatePlan,
    deletePlan,
    getAllPlan,
} = require("../controllers/planController");

// Routes Prefix => "/plans"

// Create plan & Get plans
router.route("/").post(createPlan);

// Update & Delete plan
router.route("/:id").get(getPlanById).put(updatePlan).delete(deletePlan);

//get all plan 
router.route("/").get(getAllPlan)

module.exports = router;
