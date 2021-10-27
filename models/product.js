const { Schema, model } = require("mongoose");

const productSchema = Schema({
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
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: { type: String },
  available: {
    type: Boolean,
    default: true,
  },
  img: { type: String },
});

// esto se hace para quitar el __v y el password del objeto usuario, para no mandarlo a postman en la respuesta

productSchema.methods.toJSON = function () {
  const { __v, state, ...data } = this.toObject();
  return data;
};

module.exports = model("Product", productSchema);
