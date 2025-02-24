const express = require("express");
const movieController = require("./controllers/movieController");
const roomController = require("./controllers/roomController");
const reservationController = require("./controllers/reservationController");
const dotenv = require('dotenv');  
const cors = require('cors');
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
// Películas
app.post("/movies", movieController.createMovie);
app.get("/movies", movieController.getMovies);
app.put("/movies/:id", movieController.updateMovie); 
app.delete("/movies/:id", movieController.deleteMovie); 

// Salas
app.post("/rooms", roomController.createRoom);
app.get("/rooms", roomController.getRooms);
app.put("/rooms/:id", roomController.updateRoom);
app.delete("/rooms/:id", roomController.deleteRoom); 

// Reservas
app.post("/reservations", reservationController.createReservation);
app.get("/reservations", reservationController.getReservations);
app.delete("/reservations/:id", reservationController.deleteReservation); 

const serverless = require('aws-serverless-express');
const server = serverless.createServer(app);


exports.handler = (event, context) => {
  console.log("Request received: ", event);  
  return serverless.proxy(server, event, context);
};
