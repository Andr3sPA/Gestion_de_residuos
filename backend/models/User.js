const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio"],
    minlength: [3, "El nombre de usuario es muy corto"],
    maxlength: [20, "El nombre de usuario es muy largo"],
  },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true }, // Relación con Company
  age: {
    type: Number,
    min: [18, "Debes tener al menos 18 años"],
    max: [120, "La edad máxima permitida es 120 años"],
    required: [true, "La edad es obligatoria"],
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es obligatorio"],
    match: [/\S+@\S+\.\S+/, "El correo electrónico no es válido"],
  },
  role: {
    type: String,
    enum: ["admin", "user", "guest"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"]
  }
});

module.exports = mongoose.model("User", UserSchema);
