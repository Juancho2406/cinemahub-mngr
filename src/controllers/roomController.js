var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Room = require('../models/room');
const createRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { name, capacity } = req.body;
    try {
        const newRoom = new Room({ name, capacity });
        yield newRoom.save();
        res.status(201).json(newRoom);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear la sala' });
    }
});
const getRooms = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const rooms = yield Room.find();
        res.status(200).json(rooms);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener las salas' });
    }
});
module.exports = { createRoom, getRooms };
