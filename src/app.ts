const express = require("express");
const movieController = require("./controllers/movieController");
const roomController = require("./controllers/roomController");
const reservationController = require("./controllers/reservationController");
const dotenv = require('dotenv');  
const cors = require('cors')
// const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');

// Cargar variables de entorno
dotenv.config();

// Cargar el archivo de documentación Swagger
// const swaggerDocument = YAML.load('./api/openapi-spec.yaml');

// Crear la aplicación Express
const app = express();
const port = process.env.PORT || 3000;
app.use(cors()); // Permite solicitudes de cualquier dominio

// Si deseas permitir solo solicitudes de un dominio específico:
app.use(cors({
  origin: '*', // Reemplaza con tu dominio
}));
// Usar Swagger para documentación
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API
app.post("/movies", movieController.createMovie);
app.get("/movies", movieController.getMovies);
app.delete("/movies", movieController.deleteMovie);
app.post("/rooms", roomController.createRoom);
app.get("/rooms", roomController.getRooms);
app.delete("/rooms", roomController.deleteRoom);
app.post("/reservations", reservationController.createReservation);
app.get("/reservations", reservationController.getReservations);
app.delete("/reservations", reservationController.deleteReservation);

// Exponer la aplicación para Lambda usando aws-serverless-express
const serverless = require('aws-serverless-express');
const server = serverless.createServer(app);

// Handler para Lambda
exports.handler = (event, context) => {
  console.log("Request received: ", event);  // 
  return serverless.proxy(server, event, context);
};
