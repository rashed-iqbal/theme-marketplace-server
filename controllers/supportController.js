const Support = require('../models/SupportModel');
const joi = require('joi');
const { StatusError } = require('../utils');

// Support create validation
const validateSupport = joi.object({
  pageHeading: joi.string().required(),
  pageText: joi.string().required(),
  navHeadings: joi.array().items(
    joi.object({
      title: joi.string(),
    })
  ),
  articleLink: joi.object({
    link: joi.string(),
    text: joi.string(),
  }),
  supportText: joi
    .array()
    .items(
      joi.object({
        title: joi.string().required(),
        text: joi.string().required(),
      })
    )
    .required(),
});

// Support update validation
const validateUpdateSupport = joi.object({
  pageHeading: joi.string(),
  pageText: joi.string(),
  navHeadings: joi.array().items(
    joi.object({
      title: joi.string(),
    })
  ),
  articleLink: joi.object({
    link: joi.string(),
    text: joi.string(),
  }),
  supportText: joi.array().items(
    joi.object({
      title: joi.string(),
      text: joi.string(),
    })
  ),
});

// @desc    Create Support Page
// @route   POST /supports
// @access  Private
const createSupport = async (req, res) => {
  const { error, value } = validateSupport.validate(req.body);
  if (error) throw StatusError(error.message, 400);

  const support = new Support(value);
  await support.save();
  res.status(200).send('Support page created successfully');
};

// @desc    Get Support Page
// @route   GET /supports/:id
// @access  Private
const getSupport = async (req, res) => {
  const id = req.params.id;
  if (!id) throw StatusError('Required id not found', 400);

  const support = await Support.findById(id);
  if (!support) throw StatusError('Not found!');
  res.status(200).send(support);
};

// @desc    Update Support Page
// @route   PUT /supports/:id
// @access  Private
const updateSupport = async (req, res) => {
  const id = req.params.id;
  if (!id) throw StatusError('Required id not found');
  const { error, value } = validateUpdateSupport.validate(req.body);
  if (error) throw StatusError(error.message, 400);

  await Support.findOneAndUpdate({ _id: id }, value);
  res.status(200).send('Updated successfully');
};

// @desc    Delete Support Page
// @route   DELETE /supports/:id
// @access  Private
const deleteSupport = async (req, res) => {
  const id = req.params.id;
  if (!id) throw StatusError('Required id not found', 400);
  await Support.findOneAndDelete({ _id: id });
  res.status(200).send('Support page deleted');
};

module.exports = { createSupport, getSupport, updateSupport, deleteSupport };
