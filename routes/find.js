const { Router } = require("express");
const { find } = require("../controllers/find");

const router = Router();

router.get("/:collection/:term", find);

module.exports = router;
