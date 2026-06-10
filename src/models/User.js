const mongoose = require('mongoose');

// Definimos cómo es un usuario en MongoDB.
// Cada vez que se crea un usuario, tiene que tener estos campos.
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,  // sin email no se puede crear el usuario
      unique: true,    // no pueden existir dos usuarios con el mismo email
    },
    passwordHash: {
      type: String,
      required: true,  // guardamos el hash de bcrypt, nunca la contraseña en texto plano
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user', // si no se especifica rol, queda como "user"
    },
  },
  // timestamps: true agrega createdAt y updatedAt automáticamente
  { timestamps: true }
);

// Exportamos el modelo para usarlo en los endpoints de login y registro
module.exports = mongoose.model('User', userSchema);
// Mongoose va a crear la colección "users" en MongoDB (pluraliza solo)