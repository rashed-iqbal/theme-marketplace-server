const Product = require("../models/ProductModel");
const joi = require("joi");
const { StatusError } = require("../utils");
const DownloadProduct = require("../models/DownloadProduct");
const UserStore = require("../models/UserStore");

// Product add validation
const validateProduct = joi.object({
    title: joi.string().required(),
    categories: joi.array().items(joi.string()),
    type: joi.string().required(),
    description: joi.string(),
    tags: joi.array().items(joi.string()),
    isVisible: joi.boolean(),
    features: joi.array().items(
        joi.object({
            heading: joi.string().required(),
            list: joi.array().items(joi.any()),
        })
    ),

    licenses: joi
        .object({
            personal: joi.object({
                pdf: joi.string(),
                price: joi.string(),
            }),
            commercial: joi.object({
                pdf: joi.string(),
                price: joi.string(),
            }),
            buyout: joi.object({
                pdf: joi.string(),
                price: joi.string(),
            }),
        })
        .required(),
    files: joi.object({
        images: joi.array().items(joi.string()),
        sourceFile: joi.string(),
        thumbnail: joi.string(),
    }),
    services: joi.array().items(
        joi.object({
            text: joi.string().required(),
            price: joi.number().required(),
        })
    ),
    ratings: joi.array().items(joi.string()),
    comments: joi.array().items(joi.string()),
    views: joi.number(),
    downloads: joi.number(),

    liveLink: joi.string(),
    softwares: joi.array().items(joi.string()),
});

// Product update validation
const validateUpdateProduct = joi.object({
    title: joi.string(),
    categories: joi.array().items(joi.string()),
    type: joi.string(),
    description: joi.string(),
    tags: joi.array().items(joi.string()),
    isVisible: joi.boolean(),
    features: joi.array().items(
        joi.object({
            heading: joi.string(),
            list: joi.array().items(joi.string()),
        })
    ),
    files: joi.object({
        images: joi.array().items(joi.string()),
        sourceFile: joi.string(),
        thumbnail: joi.string(),
    }),
    licenses: joi.object({
        personal: joi.object({
            pdf: joi.string(),
            price: joi.string(),
        }),
        commercial: joi.object({
            pdf: joi.string(),
            price: joi.string(),
        }),
        buyout: joi.object({
            pdf: joi.string(),
            price: joi.string(),
        }),
    }),
    services: joi.array().items(
        joi.object({
            text: joi.string(),
            price: joi.number(),
        })
    ),
    ratings: joi.array().items(joi.string()),
    comments: joi.array().items(joi.string()),
    views: joi.number(),
    downloads: joi.number(),
    liveLink: joi.string(),
    softwares: joi.array().items(joi.string()),
});

// @desc    Create New Product.
// @route   POST /products
// @access  Private
const createProduct = async (req, res) => {
    const { error, value } = validateProduct.validate(req.body);
    if (error) throw StatusError(error.message, 400);
    const product = new Product(req.body);
    await product.save();
    res.status(201).send({ message: "Product added successfully" });
};

// @desc    Get All Products
// @route   GET /products
// @access  Public
const getProducts = async (req, res) => {
    const products = await Product.find()
        .populate({
            path: "ratings",
            populate: { path: "user", select: ["firstName", "lastName"] },
        })
        .sort({ createdAt: -1 });
    if (!products.length) throw StatusError("No products found!", 404);
    res.status(200).send(products);
};

const getProductsByType = async (req, res) => {
    const { type } = req.params;
    let { productId } = req.query;
    if (!type) throw StatusError("Required type not found", 400);
    const products = await Product.find({
        type,
        _id: { $ne: productId },
    })
        .limit(10)
        .sort({ createdAt: -1 });
    if (!products.length) throw StatusError("No products found!", 404);
    res.status(200).send(products);
};

const getRecentProducts = async (req, res) => {
    const recentProducts = await Product.find().limit(20).sort({ _id: -1 });
    if (!recentProducts.length) throw StatusError("No products found!", 404);
    res.status(200).send(recentProducts);
};

const getProduct = async (req, res) => {
    const product = await Product.findById(req.params.id).populate({
        path: "ratings",
        populate: { path: "user", select: ["firstName", "lastName"] },
    });
    if (!product) throw StatusError("Product not found!", 404);
    res.status(200).send(product);
};

const updateProduct = async (req, res) => {
    // Check product exists
    const productId = req.params.id;
    if (!productId) throw StatusError("Required product id not found", 401);

    // Update Validation
    const { error, value } = validateUpdateProduct.validate(req.body);
    if (error) throw StatusError(error.message, 400);

    // Update
    const updateProduct = await Product.findOneAndUpdate(
        { _id: productId },
        value,
        {
            new: true,
        }
    );

    if (!updateProduct) throw StatusError("Product not found!", 401);

    res.status(200).send({
        message: "Product updated successfully",
        updateProduct,
    });
};

const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw StatusError("Product not found!", 404);
    product.delete();
    res.status(200).send({ message: "Product deleted" });
};

const getSingleProduct = async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate({
            path: "ratings",
            populate: { path: "user", select: ["firstName", "lastName"] },
        })
        .populate({
            path: "comments",
            populate: {
                path: "userId",
                select: ["firstName", "lastName", "profile"],
            },
        });
    if (!product) throw StatusError("Product not found!", 404);
    res.status(200).send(product);
};

const downloadProductValidator = joi.object({
    userId: joi.string().required(),
    productId: joi.string().required(),
    isDownloaded: joi.boolean(),
    license: joi.string(),
    services: joi.array(),
    support: joi.any(),
});

const downloadProductController = async (req, res) => {
    const value = await downloadProductValidator.validateAsync(req.body);

    const downloadProduct = new DownloadProduct(value);

    const checkUser = await UserStore.findOneAndUpdate(
        { userId: value.userId },
        {
            $push: {
                downloadProducts: downloadProduct._id,
            },
        },
        { new: true }
    );

    if (!checkUser) throw StatusError("User store not found");

    await downloadProduct.save();

    res.status(200).send(downloadProduct);
};

const getDownloadedProductSchema = joi.object({
    userId: joi.string().required(),
    productId: joi.string().required(),
});

const getDownloadedProduct = async (req, res) => {
    const value = await getDownloadedProductSchema.validateAsync(req.query);
    const downloadProduct = await DownloadProduct.findOne(value);
    if (!downloadProduct) throw StatusError("Data not found", 400);
    res.status(200).send(downloadProduct);
};

const updateDownloadProduct = async (req, res) => {
    const { license, services, support, userId, productId } =
        await downloadProductValidator.validateAsync(req.body);
    const checkDownloadProduct = await DownloadProduct.findOneAndUpdate(
        { userId, productId },
        { license, $push: { services }, support },
        { new: true }
    );
    if (!checkDownloadProduct)
        throw StatusError("Download Product Not found", 400);
    res.status(200).send(checkDownloadProduct);
};

const sourceDownloadSchema = joi.object({
    productId: joi.string().required(),
    userId: joi.string().required(),
    license: joi.string(),
});

const sourceDownloadController = async (req, res) => {
    const { productId, userId, license } =
        await sourceDownloadSchema.validateAsync(req.body);

    const product = await Product.findOneAndUpdate(
        { _id: productId },
        { $inc: { downloads: 1 } },
        { new: true }
    ).exec();

    const downloadProduct = await DownloadProduct.findOneAndUpdate(
        { productId, userId },
        { productId, userId, isDownloaded: true, license },
        { new: true, upsert: true }
    );

    if (!product || !downloadProduct) throw new Error("Not found", 400);

    res.status(200).send({
        message: "Product ready to download",
        link: product.files.sourceFile,
    });
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    updateDownloadProduct,
    deleteProduct,
    getRecentProducts,
    getSingleProduct,
    downloadProductController,
    getDownloadedProduct,
    sourceDownloadController,
    getProductsByType,
};
