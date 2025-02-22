const Movie = require('../models/movie');

const createMovie = async (req:any, res:any) => {
  const { title, genre, duration, rating } = req.body;
  try {
    const newMovie = new Movie({ title, genre, duration, rating });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la película' });
  }
};

const getMovies = async (req:any, res:any) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las películas' });
  }
};

module.exports = { createMovie, getMovies };
