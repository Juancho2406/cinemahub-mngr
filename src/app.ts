const express = require("express");
const movieController = require("./controllers/movieController");
const roomController = require("./controllers/roomController");
const reservationController = require("./controllers/reservationController");
const dotenv = require('dotenv');  
const cors = require('cors');
const path = require('path'); 
dotenv.config();
const oasSpec = require('./oas.json');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(cors({
  origin: '*', 
}));

app.use(express.json());

// Endpoint para exponer la especificación OAS
app.get('/api-docs', (req, res) => {
  const oasPath = path.join(__dirname, './oas.json'); 
  res.sendFile(oasPath);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(oasSpec));

app.post("/movies", movieController.createMovie);
app.get("/movies", movieController.getMovies);
app.put("/movies/:id", movieController.updateMovie); 
app.delete("/movies/:id", movieController.deleteMovie); 

app.post("/rooms", roomController.createRoom);
app.get("/rooms", roomController.getRooms);
app.put("/rooms/:id", roomController.updateRoom);
app.delete("/rooms/:id", roomController.deleteRoom); 

app.post("/reservations", reservationController.createReservation);
app.get("/reservations", reservationController.getReservations);
app.delete("/reservations/:id", reservationController.deleteReservation); 
app.put("/reservations/:id", reservationController.updateReservation); 

const serverless = require('aws-serverless-express');
const server = serverless.createServer(app);


exports.handler = (event, context) => {
 
  return serverless.proxy(server, event, context);
};
