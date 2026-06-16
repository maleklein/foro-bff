const Foro = require('../models/Foro');

// Función que maneja el GET /foros
// async porque la consulta a MongoDB tarda y no queremos bloquear el servidor.
const listForos = async (req, res) => {
  try {
    // Foro.find({}) devuelve todos los documentos de la colección "foros".
    // Si no hay foros, devuelve un array vacío [] (no es un error).
    // Mongoose pluraliza automáticamente: el modelo "Foro" mapea a la colección "foros".
    const foros = await Foro.find({});

    // 200 OK con la lista. Siempre array, aunque esté vacío.
    return res.status(200).json(foros);
  } catch (error) {
    // Si MongoDB está caído o hay algún otro problema en la consulta,
    // respondemos 500 (server error) con un mensaje genérico.
    // No exponemos el detalle del error al cliente por seguridad.
    console.error('Error en GET /foros:', error.message);
    return res.status(500).json({ message: 'Error al consultar los foros' });
  }
};

module.exports = { listForos };
