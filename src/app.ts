const express = require("express");
const mongoose = require("mongoose");
const movieController = require("./controllers/movieController");
const roomController = require("./controllers/roomController");
const reservationController = require("./controllers/reservationController");
const dotenv = require('dotenv');  
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

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

// Conectar a la base de datos de MongoDB
// mongoose
//   .connect("mongodb://localhost/cinema", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Conectado a la base de datos"))
//   .catch((err) =>
//     console.error("Error al conectar con la base de datos", err)
//   );

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
  return serverless.proxy(server, event, context);
};
