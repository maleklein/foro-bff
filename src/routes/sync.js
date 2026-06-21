const express = require('express');
const router = express.Router();

const { syncForos } = require('../controllers/syncController');

// GET / sincroniza los foros del Backend Java con MongoDB
// La ruta completa es GET /sync/foros porque en index.js
// este router se monta con el prefijo /sync
router.get('/foros', syncForos);

module.exports = router;
