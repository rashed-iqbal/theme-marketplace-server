const BillingHistory = require("../models/BillingHistory");
const ProductModel = require("../models/ProductModel");
const UserStore = require("../models/UserStore");

const handleAnalytics = async (req, res) => {
  const products = await ProductModel.find()
  if (!products.length) throw StatusError("No products found!", 404);

  const allBilling = await BillingHistory.find()
  if (!allBilling.length) throw StatusError("No billing found!", 404);

  const userStore = await UserStore.find()
  if (!userStore.length) throw StatusError("No userStore found!", 404);

  res.status(200).send({products,allBilling,userStore});
};

module.exports = { handleAnalytics };
