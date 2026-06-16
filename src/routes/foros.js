const express = require('express');
// Router de Express: agrupa rutas relacionadas bajo un mismo prefijo
const router = express.Router();

// Importamos las funciones del controller
const { listForos } = require('../controllers/forosController');

// Registramos que GET / llama a la función listForos.
// La ruta completa es GET /foros porque en index.js
// este router se monta con el prefijo /foros.
router.get('/', listForos);

module.exports = router;
