const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validateJWT } = require("../middlewares/validar-jwt");
const { esAdmin, tieneRole } = require("../middlewares/validar-roles");

const {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
} = require("../controllers/users");
const {
  isValidRole,
  emailExists,
  userExistsById,
} = require("../helpers/db-validators");

const router = Router();

router.get("/", usersGet);

router.post(
  "/",
  [
    check("name", "El nombre es requerido").not().isEmpty(),
    check(
      "password",
      "La contraseña debe tener un mínimo de 6 carcateres"
    ).isLength({ min: 6 }),
    check("mail", "El correo no es válido").isEmail(),
    check("mail").custom((mail) => emailExists(mail)),
    // check("role", "No es un tipo de usuario válido").isIn([
    //   "ADMIN_USER",
    //   "ROLE_USER",
    // ]),
    check("role").custom((rol) => isValidRole(rol)),
    // check("role").custom(isValidRole), esto es lo mismo de arriba porque el primer argumento que se obtenga es enviado a la funcion ?
    validarCampos,
  ],
  usersPost
);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(userExistsById),
    check("role").custom(isValidRole),
    validarCampos,
  ],
  usersPut
);

router.patch("/", usersPatch);

router.delete(
  "/:id",
  [
    validateJWT,
    // esAdmin,
    tieneRole("SALE_ROLE", "ADMIN_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(userExistsById),
    validarCampos,
  ],
  usersDelete
);

module.exports = router;
