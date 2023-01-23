const express = require("express");
const router = express.Router();

// Product Controllers
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getRecentProducts,
    getSingleProduct,
    downloadProductController,
    getDownloadedProduct,
    updateDownloadProduct,
    sourceDownloadController,
    getProductsByType,
} = require("../controllers/productController");

const {
    createComment,
    replyComment,
} = require("../controllers/commentController");

// Rating Controllers
const { createRating } = require("../controllers/ratingController");

// Routes Prefix => "/products"

// Create product & Get products
router.route("/").get(getProducts).post(createProduct);

// get single product without
router.get("/single/:id", getSingleProduct);

//Get recent products
router.get("/recent-products", getRecentProducts);

router.get("/by-type/:type", getProductsByType);

// Get single product, Update & Delete product
router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

// Create comment
router.post("/:id/comment", createComment); // product id
// Reply comment
router.put("/comment/:id", replyComment); // comment id

// Product Rating
router.route("/:id/ratings").post(createRating);

router.post("/download/data", downloadProductController);

router.put("/download/data", updateDownloadProduct);

router.get("/download/data", getDownloadedProduct);

router.post("/source/download", sourceDownloadController);

module.exports = router;
