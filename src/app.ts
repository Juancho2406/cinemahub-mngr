const express = require("express");
const movieController = require("./controllers/movieController");
const roomController = require("./controllers/roomController");
const reservationController = require("./controllers/reservationController");
const dotenv = require('dotenv');  
// const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');

// Cargar variables de entorno
dotenv.config();

// Cargar el archivo de documentación Swagger
// const swaggerDocument = YAML.load('./api/openapi-spec.yaml');

// Crear la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

// Usar Swagger para documentación
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware para parsear JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "¡Bienvenido a la API de CinemaHub!" });
});

// Rutas de la API
app.post("/movies", movieController.createMovie);
app.get("/movies", movieController.getMovies);

app.post("/rooms", roomController.createRoom);
app.get("/rooms", roomController.getRooms);

app.post("/reservations", reservationController.createReservation);
app.get("/reservations", reservationController.getReservations);

// Exponer la aplicación para Lambda usando aws-serverless-express
const serverless = require('aws-serverless-express');
const server = serverless.createServer(app);

// Handler para Lambda
exports.handler = (event, context) => {
  console.log("Request received: ", event);  // 
  return serverless.proxy(server, event, context);
};
