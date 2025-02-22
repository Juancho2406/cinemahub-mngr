const express = require("express");
const mongoose = require("mongoose");
const movieController = require("./controllers/movieController");
const roomController = require("./controllers/roomController");
const reservationController = require("./controllers/reservationController");
import dotenv from 'dotenv';  
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
dotenv.config();
const swaggerDocument = YAML.load('./api/openapi-spec.yaml');
const app = express();
const port = process.env.PORT || 3000;  
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

mongoose
  .connect("mongodb://localhost/cinema", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err: any) =>
    console.error("Error al conectar con la base de datos", err)
  );

app.post("/movies", movieController.createMovie);
app.get("/movies", movieController.getMovies);

app.post("/rooms", roomController.createRoom);
app.get("/rooms", roomController.getRooms);

app.post("/reservations", reservationController.createReservation);
app.get("/reservations", reservationController.getReservations);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
