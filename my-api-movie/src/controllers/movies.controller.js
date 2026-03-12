//import { books } from '../data/books.js';
import Movie from "../models/movies.model.js";

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

// | POST   | /api/movies/:id/rent   | Rent movie                            |
// | POST   | /api/movies/:id/return | Return movie                          |
// | PATCH  | /api/movies/:id/cover  | Upload / Replace cover (multipart)    |
// | GET    | /api/movies/:id/cover  | Get image from the cover              |
// | GET    | /api/movies/stats/top  | Top 5 most rented                     |