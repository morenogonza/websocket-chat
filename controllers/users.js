const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const usersGet = async (req, res = response) => {
  const { desde = 0, limite = 5 } = req.query;

  const usuarios = await User.find().skip(Number(desde)).limit(Number(limite));

  res.json(usuarios);
};

const usersPost = async (req, res) => {
  const { name, mail, password, role } = req.body;
  const user = new User({ name, mail, password, role });

  // hashear el password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();

  res.json(user);
};

const usersPut = async (req, res) => {
  const { id } = req.params;

  const { password, mail, google, ...restoInfo } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    restoInfo.password = bcryptjs.hashSync(password, salt);
  }

  try {
    const user = await User.findByIdAndUpdate(id, restoInfo, { new: true });

    res.json(user);
  } catch (error) {
    console.log("Error al hacer update", error);
  }
};

const usersDelete = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );

  res.json(user);
};

const usersPatch = (req, res) => {
  res.json({
    msg: "API patch - Controlador",
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  usersPatch,
};
