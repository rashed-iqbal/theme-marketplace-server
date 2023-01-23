const Product = require("../models/ProductModel");
const ProductRating = require("../models/ProductRatings");
const joi = require("joi");
const { StatusError } = require("../utils");

// Rating input validation
const validateRating = joi.object({
    user: joi.string().required(),
    text: joi.string().required(),
    rating: joi.number().min(1).max(5).required(),
});

// @desc    Create New Rating
// @route   POST /products/:id/ratings
// @access  Private
const createRating = async (req, res) => {
    const productId = req.params.id;
    const { error, value } = validateRating.validate(req.body);
    if (error) throw StatusError(error.message, 400);

    // Create rating
    const rating = new ProductRating({
        user: value.user, // Static for now
        text: value.text,
        rating: value.rating,
    });

    // Push the rating reference to product
    const product = await Product.findOneAndUpdate(
        { _id: productId },
        { $push: { ratings: rating.id } },
        { new: true }
    );
    if (!product) throw StatusError("Product not found");

    await rating.save();

    res.status(201).send({ message: "Rating added", rating });
};

// @desc    Update Rating
// @route   PUT /ratings/:id
// @access  Private
const updateRating = async (req, res) => {
    const ratingId = req.params.id;
    const { error, value } = validateRating.validate(req.body);
    if (error) throw StatusError(error.message, 400);

    // Update
    const updateRating = await ProductRating.findOneAndUpdate(
        { _id: ratingId },
        value,
        {
            new: true,
        }
    );

    res.status(200).send({ message: "Rating updated", updateRating });
};

const getRating = async (req, res) => {
    const ratingData = await ProductRating.find().populate("user");
    if (!ratingData) throw StatusError("Rating data not found");
    res.status(200).send(ratingData);
};

const getRatingForHome = async (req, res) => {
    const ratings = await ProductRating.find({ rating: { $gt: 3 } })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("user")
        .exec();
    if (!ratings.length) throw StatusError("Ratings not found", 400);
    res.status(200).send(ratings);
};

module.exports = { createRating, updateRating, getRating, getRatingForHome };
