const Foro = require('../models/Foro');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

// Función que maneja el GET /sync/foros
// Trae los foros del Backend Java y los sincroniza en MongoDB con upsert
const syncForos = async (req, res) => {
  // Intentamos conectarnos al Backend Java
  let response;
  try {
    response = await fetch(`${BACKEND_URL}/api/foros`);
  } catch (error) {
    // Si el Backend Java está caído o no responde, devolvemos 503 (servicio no disponible)
    console.error('Error al conectar con el Backend Java:', error.message);
    return res.status(503).json({ message: 'El Backend Java no está disponible' });
  }

  if (!response.ok) {
    console.error('El Backend Java respondió con error:', response.status);
    return res.status(503).json({ message: 'El Backend Java respondió con error' });
  }

  const forosBackend = await response.json();

  // Upsert: si ya existe un foro con ese externalId lo actualiza, si no lo crea
  // El Backend Java usa "nombre", "descripcion", "facultad" — los traducimos a los nombres de MongoDB
  const upserts = forosBackend.map((foro) =>
    Foro.findOneAndUpdate(
      { externalId: foro.id },
      {
        externalId: foro.id,
        name: foro.nombre,
        description: foro.descripcion,
        faculty: foro.facultad,
      },
      { upsert: true, new: true }
    )
  );

  try {
    const foros = await Promise.all(upserts);
    return res.status(200).json(foros);
  } catch (error) {
    console.error('Error al sincronizar foros en MongoDB:', error.message);
    return res.status(500).json({ message: 'Error al guardar los foros en MongoDB' });
  }
};

module.exports = { syncForos };
