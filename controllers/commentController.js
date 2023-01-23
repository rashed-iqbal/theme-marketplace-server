const Product = require("../models/ProductModel");

const Joi = require("joi");
const ProductComment = require("../models/ProductComments");
const { StatusError } = require("../utils");

// @desc    Create New Comment
// @route   POST /comments
// @access  Private

const createCommentSchema = Joi.object({
    userId: Joi.string(),
    text: Joi.string(),
});

const createComment = async (req, res) => {
    const { id } = req.params;
    if (!id) throw StatusError("Required id not found", 400);
    const { value, error } = createCommentSchema.validate(req.body);
    if (error) throw StatusError(error.message, 400);
    // create comment
    const productComment = new ProductComment(value);

    // push comment to product
    const product = await Product.findOneAndUpdate(
        { _id: id },
        { $push: { comments: productComment._id } },
        { new: true }
    );

    if (!product) throw StatusError("Product not found", 400);

    await productComment.save();

    res.status(200).send({
        message: "Comment created successfully",
        productComment,
    });
};

// @desc    Update Comment
// @route   PUT /comments/:id
// @access  Private
const replyCommentSchema = Joi.object({
    userId: Joi.string(),
    message: Joi.string(),
});
const replyComment = async (req, res) => {
    const { id } = req.params;
    if (!id) throw StatusError("Required comment id not found", 400);
    const { value, error } = replyCommentSchema.validate(req.body);
    if (error) throw StatusError(error.message, 400);

    const comment = await ProductComment.findOneAndUpdate(
        { _id: id },
        { $push: { reply: value } },
        { new: true }
    );

    if (!comment) throw StatusError("Comment not found", 400);

    res.status(200).send({
        message: "Comment replied successfully",
        comment,
    });
};

// @desc    Delete Comment
// @route   DELETE /comments/:id
// @access  Private
const deleteComment = async (req, res) => {
    res.json("Test3");
};

module.exports = { createComment, replyComment };
