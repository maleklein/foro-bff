const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db');
// dotenv carga las variables del archivo .env para usarlas con process.env
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Conectamos a MongoDB antes de levantar el servidor
connectDB();

// CORS permite que el frontend (que corre en otro puerto) pueda hacer requests al BFF
// credentials: true es necesario para que las cookies se envíen entre dominios distintos
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Permite que Express entienda el body de los requests en formato JSON
app.use(express.json());

// Permite leer y escribir cookies en los requests y responses
app.use(cookieParser());

// Endpoint de health check: sirve para verificar que el servidor está corriendo
// El frontend o el profe pueden llamar a GET /health para confirmar que el BFF está activo
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});