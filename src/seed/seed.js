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
//   - 5 usuarios con roles variados (admin y user) y passwords
//     encriptadas con bcrypt usando el helper de src/utils/crypto.js (GIA-17).
//   - 6 foros que cubren las facultades soportadas por el frontend.

require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = require('../db');
const User = require('../models/User');
const { hashPassword } = require('../utils/crypto');

// Contraseña en texto plano que comparten todos los usuarios de prueba.
// Se hashea con bcrypt antes de guardarla. Documentada para la demo / Postman.
const DEMO_PASSWORD = 'password123';

// ─── Usuarios de prueba ──────────────────────────────────────────────────────
// La forma coincide con el schema User del BFF: email, username, role,
// passwordHash (el hash se genera en seed(), abajo).
const USERS = [
  { email: 'admin@uap.edu.ar',  username: 'admin',   role: 'admin'     },
  { email: 'gianna@uap.edu.ar', username: 'gianna',  role: 'user'      },
  { email: 'malena@uap.edu.ar', username: 'malena',  role: 'user'      },
  { email: 'milena@uap.edu.ar', username: 'milena',  role: 'user'      },
  { email: 'jperez@uap.edu.ar', username: 'jperez',  role: 'user'      },
];

async function seed() {
  // Reutilizamos la misma conexión que usa el servidor (lee MONGODB_URI).
  await connectDB();

  try {
    // 1. Limpiamos las colecciones para que el seed sea idempotente
    //    (podés correrlo muchas veces y siempre deja el mismo estado).
    await User.deleteMany({});
    console.log('Colección users limpiada');

    // 2. Hasheamos la contraseña usando el helper de GIA-17.
    //    Todos los usuarios usan la misma para simplificar la demo.
    const passwordHash = await hashPassword(DEMO_PASSWORD);
    const users = await User.insertMany(
      USERS.map((u) => ({ ...u, passwordHash }))
    );
    console.log(`${users.length} usuarios insertados`);

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
