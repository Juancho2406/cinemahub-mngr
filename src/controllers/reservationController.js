var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Reservation = require('../models/reservation');
const createReservation = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { movie, room, seats } = req.body;
    try {
        const newReservation = new Reservation({ movie, room, seats });
        yield newReservation.save();
        res.status(201).json(newReservation);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
});
const getReservations = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const reservations = yield Reservation.find();
        res.status(200).json(reservations);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
});
module.exports = { createReservation, getReservations };
