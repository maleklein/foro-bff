const express = require('express');
// Router de Express: agrupa rutas relacionadas bajo un mismo prefijo
const router = express.Router();

// Importamos la función login del controller
const { login } = require('../controllers/authController');

// Registramos que POST /login llama a la función login
// La ruta completa es POST /auth/login porque en index.js
// este router se monta con el prefijo /auth
router.post('/login', login);

module.exports = router;