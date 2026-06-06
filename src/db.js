// Importamos Mongoose, la librería que nos permite conectarnos a MongoDB
// y definir modelos con esquemas (estructura de los datos)
const mongoose = require('mongoose');

// Función asíncrona porque la conexión a la base de datos tarda un tiempo
// y no queremos bloquear el resto del servidor mientras espera
const connectDB = async () => {
  try {
    // Intentamos conectarnos a MongoDB usando la variable de entorno MONGODB_URI
    // Si no está definida, usamos la URL local por defecto
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foro-bff');
    console.log('MongoDB connected');
  } catch (error) {
    // Si la conexión falla (MongoDB no está corriendo, URL incorrecta, etc.)
    // mostramos el error y cerramos el proceso porque sin BD el BFF no puede funcionar
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;