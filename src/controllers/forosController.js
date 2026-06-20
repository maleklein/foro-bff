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

// Función que maneja el POST /foros
// Recibe { name, description, faculty } y crea un foro nuevo en MongoDB.
const createForo = async (req, res) => {
  // Extraemos los campos del body. Si vienen como undefined, las validaciones
  // de abajo los rechazan con 400.
  const { name, description, faculty } = req.body || {};

  // Validación: name y faculty son obligatorios.
  // Usamos trim() para que un string solo de espacios no cuente como "presente".
  // description es opcional (el schema del equipo no lo marca como required).
  if (!name || !name.trim() || !faculty || !faculty.trim()) {
    return res.status(400).json({
      message: 'Los campos "name" y "faculty" son requeridos',
    });
  }

  try {
    // Creamos el documento en MongoDB. El _id lo genera Mongoose automáticamente.
    // Pasamos los campos uno por uno (no el body entero) para evitar que el
    // cliente nos meta campos no esperados (mass-assignment).
    const foro = await Foro.create({
      name: name.trim(),
      description: description ? description.trim() : undefined,
      faculty: faculty.trim(),
    });

    // 201 Created con el foro recién insertado (ya incluye _id, timestamps).
    return res.status(201).json(foro);
  } catch (error) {
    console.error('Error en POST /foros:', error.message);
    return res.status(500).json({ message: 'Error al crear el foro' });
  }
};

module.exports = { listForos, createForo };
