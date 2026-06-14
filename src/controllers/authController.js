const bcrypt = require('bcrypt');
const User = require('../models/User');

// Función que maneja el POST /auth/login
// async porque hace operaciones que tardan: buscar en MongoDB y comparar con bcrypt
const login = async (req, res) => {

  // Extraemos email y password del body del request
  // El frontend los manda así: { "email": "...", "password": "..." }
  const { email, password } = req.body;

  // Validación básica: si falta alguno de los dos, rechazamos con 400 (bad request)
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son requeridos' });
  }

  // Buscamos el usuario en MongoDB por email
  // findOne devuelve el primer documento que matchea, o null si no existe
  const user = await User.findOne({ email });

  // Si no existe el usuario, devolvemos 401 (no autorizado)
  // Usamos el mismo mensaje que para password incorrecta a propósito:
  // así no le damos pistas a alguien que intenta adivinar emails registrados
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // bcrypt.compare compara la password que ingresó el usuario
  // con el hash guardado en MongoDB (user.passwordHash)
  // Devuelve true si coinciden, false si no
  // Nunca "desencripta" — bcrypt es one-way, solo compara
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // Si las credenciales son válidas, seteamos una cookie de sesión
  // httpOnly: true → la cookie NO es accesible desde JavaScript del browser (más seguro)
  // sameSite: 'lax' → protección básica contra ataques CSRF
  // maxAge: 24 horas en milisegundos
  res.cookie('session', JSON.stringify({ userId: user._id, username: user.username }), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Devolvemos 200 con los datos del usuario (sin el passwordHash, nunca se expone)
  return res.status(200).json({
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
};

module.exports = { login };