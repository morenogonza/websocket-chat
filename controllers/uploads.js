const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { uploadFile } = require("../helpers/upload-file");

const Product = require("../models/product");
const User = require("../models/user");

const loadFile = async (req, res = response) => {
  let sampleFile;
  let uploadPath;

  try {
    // const nombreArchivo = await uploadFile(req.files, ["txt", "md"], "textos"); // al querer crear la carpeta "textos" necesitamos poner en true el createParentPath de express-fileupload
    // const nombreArchivo = await uploadFile(req.files, undefined, 'imgs'); // undefined para utilizar los parametros por defecto para poder crear la carpeta "imgs" en este caso
    const nombreArchivo = await uploadFile(req.files); // llamando a la función de esta manera no especificamos el tipo de archivo permitido ni creamos otra carpeta

    res.json({
      name: nombreArchivo,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const updateImg = async (req, res = response) => {
  const { id, collection } = req.params;

  let modelo;

  switch (collection) {
    case "users":
      modelo = await User.findById(id);

      if (!modelo)
        return res.status(400).json({
          msg: `No existe un usuario con el ID ${id}`,
        });

      break;

    case "products":
      modelo = await Product.findById(id);

      if (!modelo)
        return res.status(400).json({
          msg: `No existe un producto con el ID ${id}`,
        });

      break;

    default:
      return res.status(500).json({
        msg: `No se hizo la validación para la colección ${collection}`,
      });
  }

  // limpiar las imagenes previas
  if (modelo.img) {
    const pathImg = path.join(__dirname, "../uploads", collection, modelo.img);

    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  const nombreArchivo = await uploadFile(req.files, undefined, collection);
  modelo.img = nombreArchivo;

  await modelo.save();

  res.json(modelo);
};

const updateImgCloudinary = async (req, res = response) => {
  const { id, collection } = req.params;

  let modelo;

  switch (collection) {
    case "users":
      modelo = await User.findById(id);

      if (!modelo)
        return res.status(400).json({
          msg: `No existe un usuario con el ID ${id}`,
        });

      break;

    case "products":
      modelo = await Product.findById(id);

      if (!modelo)
        return res.status(400).json({
          msg: `No existe un producto con el ID ${id}`,
        });

      break;

    default:
      return res.status(500).json({
        msg: `No se hizo la validación para la colección ${collection}`,
      });
  }

  // limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");

    cloudinary.uploader.destroy(public_id);
  }

  // cargar imagenes en Cloudinary
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;

  await modelo.save();

  res.json(modelo);
};

const searchImg = async (req, res = response) => {
  const { id, collection } = req.params;

  let modelo;

  switch (collection) {
    case "users":
      modelo = await User.findById(id);

      if (!modelo)
        return res.status(400).json({
          msg: `No existe un usuario con el ID ${id}`,
        });

      break;

    case "products":
      modelo = await Product.findById(id);

      if (!modelo)
        return res.status(400).json({
          msg: `No existe un producto con el ID ${id}`,
        });

      break;

    default:
      return res.status(500).json({
        msg: `No se hizo la validación para la colección ${collection}`,
      });
  }

  // limpiar las imagenes previas
  if (modelo.img) {
    const pathImg = path.join(__dirname, "../uploads", collection, modelo.img);

    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }

  const pathNoImg = path.join(__dirname, "../assets", "no-image.jpg");

  res.sendFile(pathNoImg);
};

module.exports = { loadFile, updateImg, searchImg, updateImgCloudinary };
