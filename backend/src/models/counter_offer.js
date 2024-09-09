const { Schema, model } = require("mongoose");

const CounterOfferSchema = new Schema({
  description: {
    type: String,
    required: [true, "La descripción de la oferta es obligatoria"],
  },
  offer_id: { type: Schema.Types.ObjectId, ref: "Offer", required: true },
  buyer: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Usuario vendedor
  company_buyer: { type: Schema.Types.ObjectId, ref: "Company", required: true }, // Empresa del vendedor
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "waiting",
    enum: ["waiting", "accepted", "rejected"]
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = model("CounterOffer", CounterOfferSchema);

