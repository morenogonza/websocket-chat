const { Schema, model } = require("mongoose");

const categorySchema = Schema({
  name: {
    type: String,
    require: [true, "El nombre de la categoría es requerido"],
  },
  state: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Category", categorySchema);
