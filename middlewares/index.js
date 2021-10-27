const { validateFile } = require("./validar-archivo");
const { validarCampos } = require("./validar-campos");
const { validateJWT } = require("./validar-jwt");
const { esAdmin, tieneRole } = require("./validar-roles");

module.exports = {
  validateFile,
  validarCampos,
  validateJWT,
  esAdmin,
  tieneRole,
};
