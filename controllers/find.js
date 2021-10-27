const { response } = require("express");

const {
  findUsers,
  findCategories,
  findProducts,
} = require("../helpers/finders");

const permitedCollections = ["users", "category", "products", "roles"];

const find = (req, res = response) => {
  const { collection, term } = req.params;

  if (!permitedCollections.includes(collection))
    return res.status(400).json({
      msg: `Las colecciones permitidas son ${permitedCollections}`,
    });

  switch (collection) {
    case "users":
      findUsers(term, res);
      break;
    case "category":
      findCategories(term, res);
      break;
    case "products":
      findProducts(term, res);
      break;
    default:
      res.status(500).json({
        msg: `No se hizo la busqueda de esta colección ${collection}`,
      });
      break;
  }
};

module.exports = { find };
