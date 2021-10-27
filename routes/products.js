const { Router } = require("express");
const { check } = require("express-validator");
const {
  createProduct,
  getProducts,
  getProductFromId,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const { categoryExists, productExists } = require("../helpers/db-validators");

const { validarCampos } = require("../middlewares/validar-campos");
const { validateJWT } = require("../middlewares/validar-jwt");
const { esAdmin } = require("../middlewares/validar-roles");

const router = Router();

// obtener todos los productos - acceso publico
router.get("/", getProducts);

// obtener un producto por ID - acceso publico
router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(productExists),
    validarCampos,
  ],
  getProductFromId
);

// crear un nuevo producto - solo usuario registrado que tenga un token válido
router.post(
  "/",
  [
    validateJWT,
    check("name", "El campo name es campo obligatorio").not().isEmpty(),
    check("category", "El campo category es obligatorio").not().isEmpty(),
    check("category", "No es un ID de Mongo válido").isMongoId(),
    check("category").custom(categoryExists),
    validarCampos,
  ],
  createProduct
);

// actualizar un producto - solo usuario administrador
router.put(
  "/:id",
  [
    validateJWT,
    esAdmin,
    check("name", "El campo name es obligatorio").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  updateProduct
);

// eliminar un producto - solo usuario administrador
router.delete(
  "/:id",
  [
    validateJWT,
    esAdmin,
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  deleteProduct
);

module.exports = router;
