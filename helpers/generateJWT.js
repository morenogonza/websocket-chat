const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

const generateJWT = async (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jsonwebtoken.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log("Error al generar Token", err);
          reject("Se generó un error al generar el toke");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const checkJWT = async (token = "") => {
  if (token.length < 10) {
    return null;
  }

  try {
    const { uid } = jsonwebtoken.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await User.findById(uid);

    if (!user) return null;

    if (!user.state) return null;

    return user;
  } catch (error) {
    return error;
  }
};

module.exports = { generateJWT, checkJWT };
