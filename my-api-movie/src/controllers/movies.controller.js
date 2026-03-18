//import { books } from '../data/books.js';
import Movie from "../models/movies.model.js";
import Storage from "../models/storage.model.js";
import { join } from "node:path";

const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3000";

// GET /api/movies
export const getAll = async (req, res) => {
  let results;
  const { title, director, year, genre } = req.query;

  const filter = {};

  if(title) { filter.title = title; }
  if(director) { filter.director = director; }
  if(!isNaN(year)) { filter.year = year; }
  if(genre) { filter.genre = genre; }

  results = await Movie.find(filter);   
  
  if(!results || results.length === 0) {
    res.status(404).json({ error: 'No correspondances' });
  }
  res.json(results);
};

// GET /api/movies/:id
export const getByID = async (req, res) => {
    const id = req.params.id;
    
    try {
        const movie = await Movie.findById(id);
        if (movie) {
          res.json(movie);
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
    } catch {
        res.status(404).json({ error: 'Movie not found' });
    }
}

// POST /api/movies
export const post = async (req, res) => {
  const { title, director, year, genre, copies, availableCopies, timesRented, cover } = req.body;

  const newMovie = await Movie.create({ title: title, director: director, year: year, genre: genre, copies: copies, availableCopies: availableCopies, timesRented: timesRented, cover: cover });
  
  res.status(201).json({message: "Movie " + title + " created", content: newMovie});
};

// PUT /api/movie/:id
export const put = async (req, res) => {
  const id = req.params.id;
  
  try {
    const { title, director, year, genre, copies, availableCopies, timesRented, cover } = req.body;
    const attributes = { title, director, year, genre, copies, availableCopies, timesRented, cover };
    const updatedMovie = await Movie.findByIdAndUpdate(id, attributes, { new: true });

    res.status(200).json({ message: 'Movie n°' + id + ' fully updated', content: updatedMovie });
  } catch (e) {
    res.status(404).json({ error: 'Movie not found'});
  }
}

// DELETE /api/movies/:id 
export const deleteMovie = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);
    res.status(200).json({ message: 'Movie ' + id + ' deleted', content: deletedMovie });
  } catch {
    res.status(404).json({ error: 'Movie not found'});
  }
}

// POST /api/movies/:id/rent 
export const rent = async (req, res) => {
  const id = req.params.id;
  
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, {$inc : {'timesRented' : 1}, $inc: {'availableCopies': -1}}, { new: true });

    res.status(200).json({ message: 'Movie n°' + id + ' rented', content: updatedMovie });
  } catch (e) {
    res.status(404).json({ error: 'Movie not found'});
  }
}

// POST /api/movies/:id/return
export const returnMovie = async (req, res) => {
  const id = req.params.id;
  
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, {$inc : {'availableCopies' : 1}}, { new: true });

    res.status(200).json({ message: 'Movie n°' + id + ' returned', content: updatedMovie });
  } catch (e) {
    res.status(404).json({ error: 'Movie not found'});
  }
}

// PATCH /api/movies/:id/cover
export const uploadMovieCover = async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  const { filename, originalname, mimetype, size } = req.file;

  const fileData = await Storage.create({
    filename,
    originalName: originalname,
    url: `${PUBLIC_URL}/storage/${filename}`,
    mimetype,
    size
  });

  movie.cover = filename;
  await movie.save();

  res.json({
    message: "Cover uploaded",
    cover: filename,
    storage: fileData
  });
};

// GET /api/movies/:id/cover
export const getMovieCover = async (req, res) => {

  const movie = await Movie.findById(req.params.id);

  if (!movie || !movie.cover) {
    return res.status(404).json({ error: "Cover not found" });
  }

  const filePath = join(process.cwd(), "storage", movie.cover);

  res.sendFile(filePath);
};

// GET /api/movies/stats/top
export const getTop = async (req, res) => {

  const results = await Movie.find().sort({ timesRented: 'desc' }).limit(5);   
  
  if(!results || results.length === 0) {
    res.status(404).json({ error: 'No correspondances' });
  }
  res.json(results);
};