import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  seats: { type: [String], required: true }, // Array de asientos reservados
});


module.exports = mongoose.model('Reservation', reservationSchema);