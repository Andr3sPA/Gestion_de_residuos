const { Schema, model } = require("mongoose");

const OfferSchema = new Schema({
  description: {
    type: String,
    required: [true, "La descripción de la oferta es obligatoria"],
  },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Usuario vendedor
  waste: { type: Schema.Types.ObjectId, ref: "Waste", required: true }, // Residuos relacionados
  company_seller: { type: Schema.Types.ObjectId, ref: "Company", required: true }, // Empresa del vendedor
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "available",
    enum: ["available", "expired", "sold"]
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = model("Offer", OfferSchema);
