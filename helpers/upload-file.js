const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFile = async (
  { archivo },
  extensionesValidas = ["jpg", "jpeg", "png", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const archivoSplit = archivo.name.split(".");
    const extension = archivoSplit[archivoSplit.length - 1];

    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extensión ${extension} no está permitida. Extensiones válidas: ${extensionesValidas}`
      );
    }

    const tempName = uuidv4() + "." + extension;

    uploadPath = path.join(__dirname, "../uploads/", carpeta, tempName);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(tempName);
    });
  });
};

module.exports = { uploadFile: uploadFile };
