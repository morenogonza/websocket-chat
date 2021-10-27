const { Router } = require("express");
const { check } = require("express-validator");

const {
  uploadFile,
  updateImg,
  loadFile,
  searchImg,
  updateImgCloudinary,
} = require("../controllers/uploads");
const { validarCampos } = require("../middlewares/validar-campos");
const { permitedCollections } = require("../helpers/db-validators");
const { validateFile } = require("../middlewares/validar-archivo");

const router = Router();

router.post("/", validateFile, loadFile);

router.put(
  "/:collection/:id",
  [
    check("collection", 'Debe envíar el argumento "collection" en la request')
      .not()
      .isEmpty(),
    check("id", "Debe ser un ID de Mongo válido").isMongoId(),
    check("collection").custom((c) =>
      permitedCollections(c, ["users", "products"])
    ),
    validateFile,
    validarCampos,
  ],
  // updateImg
  updateImgCloudinary
);

router.get(
  "/:collection/:id",
  [
    check("collection", 'Debe envíar el argumento "collection" en la request')
      .not()
      .isEmpty(),
    check("id", "Debe ser un ID de Mongo válido").isMongoId(),
    check("collection").custom((c) =>
      permitedCollections(c, ["users", "products"])
    ),
    validarCampos,
  ],
  searchImg
);

module.exports = router;
