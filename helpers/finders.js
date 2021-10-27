const { ObjectId } = require("mongoose").Types;

const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");

const findUsers = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const user = await Category.findById(term);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const cant = await Category.count({
    $or: [{ name: regex }, { mail: regex }],
    $and: [{ state: true }],
  });

  const users = await Category.find({
    $or: [{ name: regex }, { mail: regex }],
    $and: [{ state: true }],
  });
  return res.json({
    results: cant,
    users,
  });
};

const findCategories = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const category = await Category.findById(term);
    return res.json({
      results: category ? [category] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const cant = await Category.count({
    name: regex,
    state: true,
  });

  const categories = await Category.find({
    name: regex,
    state: true,
  });

  return res.json({
    results: cant,
    users: categories,
  });
};

const findProducts = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const product = await Product.findById(term);
    return res.json({
      results: product ? [product] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const cant = await Product.count({
    name: regex,
    state: true,
  });

  const products = await Product.find({
    name: regex,
    state: true,
  });

  return res.json({
    results: cant,
    users: products,
  });
};

module.exports = { findUsers, findCategories, findProducts };
