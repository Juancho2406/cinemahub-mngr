const Room = require('../models/room');

const createRoom = async (req:any, res:any) => {
  const { name, capacity } = req.body;
  try {
    const newRoom = new Room({ name, capacity });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la sala' });
  }
};

const getRooms = async (req:any, res:any) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las salas' });
  }
};

module.exports = { createRoom, getRooms };