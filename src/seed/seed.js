// Script de seed: carga datos iniciales en MongoDB para que el BFF pueda
// responder (login, listado de foros) sin depender de que el Backend Java
// esté corriendo. Indispensable para la demo.
//
// Uso:
//   npm run seed
//   o equivalente:  node src/seed/seed.js
//
// OJO: borra y recrea las colecciones `users` y `foros`. NO correr en prod.
//
// Datos generados:
//   - 5 usuarios con roles variados (admin, moderator, user) y passwords
//     encriptadas con bcrypt usando el helper de src/utils/crypto.js (GIA-17).
//   - 6 foros que cubren las facultades soportadas por el frontend.

require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = require('../db');
const User = require('../models/User');
const Foro = require('../models/Foro');
const { hashPassword } = require('../utils/crypto');

// Contraseña en texto plano que comparten todos los usuarios de prueba.
// Se hashea con bcrypt antes de guardarla. Documentada para la demo / Postman.
const DEMO_PASSWORD = 'password123';

// ─── Usuarios de prueba ──────────────────────────────────────────────────────
// La forma coincide con el schema User del BFF: email, username, role,
// passwordHash (el hash se genera en seed(), abajo).
const USERS = [
  { email: 'admin@uap.edu.ar',  username: 'admin',   role: 'admin'     },
  { email: 'gianna@uap.edu.ar', username: 'gianna',  role: 'moderator' },
  { email: 'malena@uap.edu.ar', username: 'malena',  role: 'moderator' },
  { email: 'milena@uap.edu.ar', username: 'milena',  role: 'user'      },
  { email: 'jperez@uap.edu.ar', username: 'jperez',  role: 'user'      },
];

// ─── Foros de prueba ─────────────────────────────────────────────────────────
// Los campos coinciden con el schema Foro del BFF: nombre, descripcion,
// facultad. Las claves de `facultad` matchean con FACULTY_CONFIG del frontend
// (humanidades, economicas, teologia, salud, instituto, preuniversitario,
// general). El foro 'general' va al final, igual que en el ordenamiento de
// la página de foros.
const FOROS = [
  {
    nombre: 'Humanidades',
    descripcion: 'Carreras de letras, historia, filosofía y educación.',
    facultad: 'humanidades',
  },
  {
    nombre: 'Ciencias Económicas',
    descripcion: 'Administración, contabilidad, comercio y economía.',
    facultad: 'economicas',
  },
  {
    nombre: 'Teología',
    descripcion: 'Estudios bíblicos, teológicos y pastorales.',
    facultad: 'teologia',
  },
  {
    nombre: 'Ciencias de la Salud',
    descripcion: 'Medicina, enfermería, nutrición y bioquímica.',
    facultad: 'salud',
  },
  {
    nombre: 'Instituto Superior',
    descripcion: 'Carreras técnicas y tecnicaturas del instituto.',
    facultad: 'instituto',
  },
  {
    nombre: 'Comunidad UAP',
    descripcion: 'Espacio general para toda la universidad.',
    facultad: 'general',
  },
];

async function seed() {
  // Reutilizamos la misma conexión que usa el servidor (lee MONGODB_URI).
  await connectDB();

  try {
    // 1. Limpiamos las colecciones para que el seed sea idempotente
    //    (podés correrlo muchas veces y siempre deja el mismo estado).
    await Promise.all([User.deleteMany({}), Foro.deleteMany({})]);
    console.log('Colecciones limpiadas (users, foros)');

    // 2. Hasheamos la contraseña usando el helper de GIA-17.
    //    Todos los usuarios usan la misma para simplificar la demo.
    const passwordHash = await hashPassword(DEMO_PASSWORD);
    const users = await User.insertMany(
      USERS.map((u) => ({ ...u, passwordHash }))
    );
    console.log(`${users.length} usuarios insertados`);

    // 3. Insertamos los foros tal cual.
    const foros = await Foro.insertMany(FOROS);
    console.log(`${foros.length} foros insertados`);

    // 4. Resumen amigable para la demo.
    console.log('\nSeed completado.');
    console.log('Credenciales de prueba (todas con la misma contraseña):');
    console.log(`   contraseña: ${DEMO_PASSWORD}`);
    USERS.forEach((u) =>
      console.log(`   - ${u.email.padEnd(24)} (${u.role})`)
    );
  } catch (err) {
    console.error('Error durante el seed:', err.message);
    process.exitCode = 1;
  } finally {
    // Cerramos la conexión para que el proceso termine.
    await mongoose.disconnect();
    console.log('\nConexión cerrada.');
  }
}

seed();
