const WasteSchema = new Schema({
  type: {
    type: String,
    required: [true, "El tipo de residuo es obligatorio"],
  },
  description: {
    type: String,
    required: [true, "La descripción del residuo es obligatoria"],
  },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true }, // Empresa que sube el residuo
});

module.exports = mongoose.model("Waste", WasteSchema);
