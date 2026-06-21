const bcrypt = require('bcrypt');

// Usamos bcrypt y no base64 porque:
// - base64 no encripta, solo codifica — cualquiera puede revertirlo
// - bcrypt es one-way: no se puede recuperar la contraseña original
// - bcrypt agrega un salt automático, así dos passwords iguales dan hashes distintos

// Encripta una contraseña en texto plano. El 10 es el "costo" (cuántas veces se procesa).
const hashPassword = (plainPassword) => {
  return bcrypt.hash(plainPassword, 10);
};

// Compara una contraseña en texto plano con un hash guardado en MongoDB.
// Devuelve true si coinciden, false si no.
const comparePassword = (plainPassword, hash) => {
  return bcrypt.compare(plainPassword, hash);
};

module.exports = { hashPassword, comparePassword };
