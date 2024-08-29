const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const User = new Schema({
  username: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio"],
    minlength: [3, "El nombre de usuario es muy corto"],
    maxlength: [20, "El nombre de usuario es muy largo"],
  },
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
  password:{
    type:String,
    required: [true, "La contraseña es obligatoria"]
  }
});
// Export model
module.exports = mongoose.model("User", User);