"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const movieController = require("./controllers/movieController");
const roomController = require("./controllers/roomController");
const reservationController = require("./controllers/reservationController");
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
dotenv_1.default.config();
const swaggerDocument = yamljs_1.default.load('./api/openapi-spec.yaml');
const app = express();
const port = process.env.PORT || 3000;
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use(express.json());
mongoose
    .connect("mongodb://localhost/cinema", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Conectado a la base de datos"))
    .catch((err) => console.error("Error al conectar con la base de datos", err));
app.post("/movies", movieController.createMovie);
app.get("/movies", movieController.getMovies);
app.post("/rooms", roomController.createRoom);
app.get("/rooms", roomController.getRooms);
app.post("/reservations", reservationController.createReservation);
app.get("/reservations", reservationController.getReservations);
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
