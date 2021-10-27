const { response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/generateJWT");
const googleVerify = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { mail, password } = req.body;

  const user = await User.findOne({ mail });

  // verificar si el usuario existe
  if (!user)
    return res.status(400).json({ msg: "Usuario / Mail no existe - corre" });

  // verificamos el estado
  if (!user.state)
    return res
      .status(400)
      .json({ msg: "Usuario / Mail no existe - usuario inactivo" });

  // verificamos si el password es el correcto
  const validPass = bcryptjs.compareSync(password, user.password);
  if (!validPass)
    return res.status(400).json({ msg: "Usuario / Mail no existe - password" });

  // generar el JWT
  const token = await generateJWT(user.id);

  res.json({ usuario: user, token });

  try {
  } catch (error) {
    res.status(500).json({
      msg: "Algo salio mal, comuníquese con el administrador",
    });
  }
};

const googleSingIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { mail, name, picture } = await googleVerify(id_token);

    let user = await User.findOne({ mail });

    if (!user) {
      // si no existe tengo que crearlo en la BD
      const data = {
        name,
        mail,
        password: "asd",
        picture,
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    // si el usuario en la BD
    if (!user.state)
      return res.status(401).json({
        msg: "Hable con el Administrador, usuario bloqueado",
      });

    // generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "No se pudo obtener el token de Google",
    });
  }
};

const validateJWTControll = async (req, res = response) => {
  const { user } = req;

  // generar el JWT
  const token = await generateJWT(user.id);

  res.json({ user, token });
};

module.exports = { login, googleSingIn, validateJWTControll };
