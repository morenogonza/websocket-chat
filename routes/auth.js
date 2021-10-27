const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validateJWT } = require("../middlewares/");

const {
  login,
  googleSingIn,
  validateJWTControll,
} = require("../controllers/auth");

const router = Router();

router.post(
  "/login",
  [
    check("mail", "El correo es un campo obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  "/google",
  [
    check("id_token", "Es necesario el token de google").not().isEmpty(),
    validarCampos,
  ],
  googleSingIn
);

router.get("/", validateJWT, validateJWTControll);

module.exports = router;
