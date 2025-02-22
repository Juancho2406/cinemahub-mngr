const Reservation = require('../models/reservation');

const createReservation = async (req:any, res:any) => {
  const { movie, room, seats } = req.body;
  try {
    const newReservation = new Reservation({ movie, room, seats });
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

const getReservations = async (req:any, res:any) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
};

module.exports = { createReservation, getReservations };