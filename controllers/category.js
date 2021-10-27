const { request } = require("express");
const Category = require("../models/category");

// obtener categorias - paginado - total -populate

const getCategories = async (req = request, res) => {
  const { desde = 0, limite = 5 } = req.query;

  const categories = await Category.find()
    .populate("user", "-_id name")
    .limit(Number(limite))
    .skip(Number(desde));

  res.json({ categories });
};

// obtener categoria por id - populate {}

const getCategoryFromId = async (req, res) => {
  const category = await Category.findById(req.params.id).populate(
    "user",
    "name -_id"
  );

  res.json({ category });
};

const createCategory = async (req, res) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB)
    return res.status(400).json({
      msg: `La categoria ${categoryDB.name} ya existe`,
    });

  const data = {
    name: name.toUpperCase(),
    user: req.user._id,
  };

  const category = new Category(data);

  await category.save();

  res.status(201).json({ category });
};

// actualizar categoria

const updateCategory = async (req, res) => {
  const { name } = req.body;
  const user = req.user._id;

  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    { name: name.toUpperCase(), user },
    { new: true }
  );

  res.json({
    category,
  });
};

// borrar categoria - state: false
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  category.state = false;

  await category.save();

  res.json(category);
};

module.exports = {
  getCategories,
  createCategory,
  getCategoryFromId,
  updateCategory,
  deleteCategory,
};
