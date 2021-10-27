const { request } = require("express");
const { body } = require("express-validator");
const Product = require("../models/product");

// obtener productos - paginado - total -populate
const getProducts = async (req = request, res) => {
  try {
    const { desde = 0, limite = 5 } = req.query;

    const products = await Product.find()
      .populate("category", "-_id name")
      .populate("user", "-_id name")
      .limit(Number(limite))
      .skip(Number(desde));

    res.json({ products });
  } catch (error) {
    res.status(500).send(error);
  }
};

// obtener producto por id - populate {}
const getProductFromId = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "-_id name")
    .populate("user", "-_id name");

  res.json({ product });
};

// crear producto
const createProduct = async (req, res) => {
  try {
    const { user, state, ...body } = req.body;
    const name = body.name.toUpperCase();

    const productDB = await Product.findOne({ name });

    if (productDB)
      return res.status(400).json({
        msg: `El producto ${productDB.name} ya existe`,
      });

    const data = {
      ...body,
      name: body.name.toUpperCase(),
      user: req.user._id,
    };

    body.user = req.user._id;

    const product = new Product(data);

    await product.save();

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

// actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { state, user, ...data } = req.body;
    if (data.name) {
      data.name = data.name.toUpperCase();
    }

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(
      id,
      { data },
      { new: true }
    );

    res.json({
      product,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// borrar producto - state: false
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  product.available = false;

  await product.save();

  res.json(product);
};

module.exports = {
  getProducts,
  getProductFromId,
  createProduct,
  updateProduct,
  deleteProduct,
};
