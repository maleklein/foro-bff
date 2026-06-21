const mongoose = require('mongoose');

// Definimos cómo es un foro en MongoDB.
const foroSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // todo foro necesita un nombre
    },
    description: {
      type: String,   // opcional, puede no tener descripción
    },
    faculty: {
      type: String,   // facultad a la que pertenece el foro (ej: "fci", "fce")
    },
    externalId: {
      type: Number,
      unique: true,
      sparse: true, // permite que foros creados por POST /foros (sin externalId) coexistan
    },
  },
  // timestamps: true agrega createdAt y updatedAt automáticamente
  { timestamps: true }
);

// Exportamos el modelo para usarlo en los endpoints de foros
module.exports = mongoose.model('Foro', foroSchema);
// Mongoose va a crear la colección "foros" en MongoDB (pluraliza solo)