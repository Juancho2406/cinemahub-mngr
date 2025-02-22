"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reservationSchema = new mongoose_1.default.Schema({
    movie: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Movie', required: true },
    room: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Room', required: true },
    seats: { type: [String], required: true }, // Array de asientos reservados
});
module.exports = mongoose_1.default.model('Reservation', reservationSchema);
