const { Schema, model } = require("mongoose");

const roleSchema = Schema({
  role: {
    type: String,
    require: true,
  },
});

module.exports = model("Role", roleSchema);
