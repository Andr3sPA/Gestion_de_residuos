const { Schema, model } = require("mongoose");

const OfferSchema = new Schema({
  description: {
    type: String,
    required: [true, "La descripción de la oferta es obligatoria"],
  },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Usuario vendedor
  buyer: { type: Schema.Types.ObjectId, ref: "User", required: false },  // Usuario comprador
  waste: { type: Schema.Types.ObjectId, ref: "Waste", required: true }, // Residuos relacionados
  company_seller: { type: Schema.Types.ObjectId, ref: "Company", required: true }, // Empresa del vendedor
  company_buyer: { type: Schema.Types.ObjectId, ref: "Company", required: false }, // Empresa del comprador
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model("Offer", OfferSchema);
