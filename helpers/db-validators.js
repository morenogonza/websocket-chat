const { Collection } = require("mongoose");
const Role = require("../models//role");
const Category = require("../models/category");
const Product = require("../models/product");
const User = require("../models/user");

const isValidRole = async (role = "") => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) throw new Error("El rol enviado no existe");
};

const emailExists = async (mail) => {
  const existe = await User.findOne({ mail });
  if (existe) throw new Error("El email ya se encuentra registrado");
};

const userExistsById = async (id) => {
  const existe = await User.findOne({ id });
  if (!existe) throw new Error(`No existe el usuario con el ID ${id}`);
};

const categoryExists = async (id) => {
  const existe = await Category.findById(id);
  if (!existe) throw new Error(`No existe la categoría con el ID ${id}`);
};

const productExists = async (id) => {
  const existe = await Product.findById(id);
  if (!existe) throw new Error(`No existe el producto con el ID ${id}`);
};

const permitedCollections = (collection = "", collections = []) => {
  if (!collections.includes(collection)) {
    throw new Error(
      `La colección ${collection} no está permitida - ${collections}`
    );
  }
  return true;
};

module.exports = {
  isValidRole,
  emailExists,
  userExistsById,
  categoryExists,
  productExists,
  permitedCollections,
};
