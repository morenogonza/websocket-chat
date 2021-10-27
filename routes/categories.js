const { Router } = require("express");
const { check } = require("express-validator");
const {
  createCategory,
  getCategories,
  getCategoryFromId,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { categoryExists } = require("../helpers/db-validators");

const { validarCampos } = require("../middlewares/validar-campos");
const { validateJWT } = require("../middlewares/validar-jwt");
const { esAdmin } = require("../middlewares/validar-roles");

const router = Router();

// obtener todas las categorias - acceso publico
router.get("/", getCategories);

// obtener una categoria por ID - acceso publico
router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(categoryExists),
    validarCampos,
  ],
  getCategoryFromId
);

// crear una nueva categoria - solo usuario registrado que tenga un token válido
router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es campo obligatorio").not().isEmpty(),
    validarCampos,
  ],
  createCategory
);

// actualizar una categoria - solo usuario administrador
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("name", "Debe ingresar el nombre de la categoría para actualizar")
      .not()
      .isEmpty(),
    check("id").custom(categoryExists),
    validarCampos,
  ],
  updateCategory
);

// eliminar una categoria
router.delete(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(categoryExists),
    esAdmin,
    validarCampos,
  ],
  deleteCategory
);

module.exports = router;
