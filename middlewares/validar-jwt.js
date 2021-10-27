const { request, response } = require("express");
const jsonwebtoken = require("jsonwebtoken");

const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-auth");

  if (!token) return res.status(401).send("No se envió el token");

  try {
    const { uid } = jsonwebtoken.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await User.findById(uid);

    // verificar que el usuario existe
    if (!user) return res.status(401).json({ msg: "Token no válido" });

    // verificar si el estado del usuario es true
    if (!user.state) return res.status(401).json({ msg: "Token no válido" });

    req.user = user;

    next();
  } catch (error) {
    console.log("error al verificar token", error);
    res.status(401).send("Token inválido");
  }
};

module.exports = { validateJWT };
