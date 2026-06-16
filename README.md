# foro-bff

Backend for Frontend del proyecto Foro UAP.

## Setup

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Copiar el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
4. Iniciar el servidor:
   ```bash
   npm start
   ```

El servidor levanta en `http://localhost:4000`.

## Variables de entorno

| Variable       | Descripción                        | Default                               |
|----------------|------------------------------------|---------------------------------------|
| `PORT`         | Puerto del servidor                | `4000`                                |
| `MONGODB_URI`  | URI de conexión a MongoDB          | `mongodb://localhost:27017/foro-bff`  |
| `FRONTEND_URL` | URL del frontend (CORS)            | `http://localhost:3000`               |
| `BACKEND_URL`  | URL del backend Java               | `http://localhost:8080`               |

## Endpoints

| Método | Ruta      | Descripción                              |
|--------|-----------|------------------------------------------|
| GET    | `/health` | Health check                             |
| GET    | `/foros`  | Lista todos los foros desde MongoDB      |

### GET /foros

Devuelve la lista de foros guardados en MongoDB.

**Respuesta `200 OK`** (array de foros, vacío si no hay):

```json
[
  {
    "_id": "65a...",
    "name": "Ingeniería en Sistemas",
    "description": "Carreras de informática y computación.",
    "faculty": "fci",
    "createdAt": "2026-06-16T12:00:00.000Z",
    "updatedAt": "2026-06-16T12:00:00.000Z"
  }
]
```

**Respuesta `500`** si la consulta a MongoDB falla:

```json
{ "message": "Error al consultar los foros" }
```

## Estructura

```
src/
├── controllers/   # Lógica de negocio
├── middlewares/   # Middlewares Express
├── models/        # Modelos Mongoose
├── routes/        # Definición de rutas
├── services/      # Llamadas al backend Java
├── db.js          # Conexión a MongoDB
└── index.js       # Entry point
```
