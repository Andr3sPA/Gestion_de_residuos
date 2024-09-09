const { Schema, model } = require("mongoose");

const WasteSchema = new Schema({
  type: {
    type: String,
    required: [true, "El tipo de residuo es obligatorio"],
  },
  description: {
    type: String,
    required: [true, "La descripción del residuo es obligatoria"],
  },
  measure_unit: {
    type: String,
    required: [true, "La unidad de medida es obligatoria"],
  },
  quantity: {
    type: Number,
    required: [true, "La cantidad del residuo es obligatoria"],
  },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true }, // Empresa que sube el residuo
});

module.exports = model("Waste", WasteSchema);
