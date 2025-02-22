var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Movie = require('../models/movie');
const createMovie = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { title, genre, duration, rating } = req.body;
    try {
        const newMovie = new Movie({ title, genre, duration, rating });
        yield newMovie.save();
        res.status(201).json(newMovie);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear la película' });
    }
});
const getMovies = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const movies = yield Movie.find();
        res.status(200).json(movies);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener las películas' });
    }
});
module.exports = { createMovie, getMovies };
