const mongoose = require('mongoose');

// Definimos cómo es un foro en MongoDB.
// Los nombres de campo están en español para coincidir con la API del
// Backend Java y con la convención que usa el frontend. Así el flujo
// completo (Backend Java → BFF → Frontend) habla el mismo idioma sin
// necesidad de mapeo en cada capa.
const foroSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true, // todo foro necesita un nombre
    },
    descripcion: {
      type: String,   // opcional, puede no tener descripción
    },
    facultad: {
      type: String,   // facultad a la que pertenece el foro
                      // ej: "humanidades", "economicas", "teologia",
                      //     "salud", "instituto", "preuniversitario", "general"
    },
    // ID del foro en el Backend Java (BD relacional). Se usa para hacer
    // upsert en el endpoint de sync sin duplicar foros que vienen del backend.
    // sparse: permite que foros creados por POST /foros (sin externalId)
    // coexistan en la colección sin violar la unicidad.
    externalId: {
      type: Number,
      unique: true,
      sparse: true,
    },
  },
  // timestamps: true agrega createdAt y updatedAt automáticamente
  { timestamps: true }
);

// Exportamos el modelo para usarlo en los endpoints de foros
module.exports = mongoose.model('Foro', foroSchema);
// Mongoose va a crear la colección "foros" en MongoDB (pluraliza solo)
