const { Schema, model } = require("mongoose");

const CompanySchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre de la empresa es obligatorio"],
  },
  employees: [{ type: Schema.Types.ObjectId, ref: "User" }], // Relación con los usuarios (empleados)
  wastes: [{ type: Schema.Types.ObjectId, ref: "Waste" }] // Relación con los residuos
});

module.exports = model("Company", CompanySchema);

