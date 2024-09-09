
const { Schema, model } = require("mongoose");

const SaleSchema = new Schema({
  offer_id: {
    type: Schema.Types.ObjectId, ref: "Offer", required: true
  },
  counter_offer_id: {
    type: Schema.Types.ObjectId, ref: "CounterOffer", required: true
  },
  price: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = model("Sale", SaleSchema);
