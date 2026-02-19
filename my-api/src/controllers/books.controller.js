import { books } from '../data/books.js';

// GET /api/books
export const getAll = (req, res) => {
  let results = [...books];
  const { id, title, author, year, pages } = req.query;

  if(author) {
    results = results.filter(b => b.author === author)
  } 
  if(year && results) {
    results = results.filter(b => b.year === year)
  } 
  if(pages && results) {
    results = results.filter(b => b.pages === pages)
  } 
  
  if(!results) {
    res.status(404).json({ error: 'No correspondances' });
  }
  res.json(results);
};

// GET /api/books/:id
export const getById = (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if(!book) {
    res.status(404).json({ error: 'Book not found' });
  }
  
  res.json(book);
};

// POST /api/books
export const post = (req, res) => {
  const { id, title, author, year, pages } = req.query;

  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    pages: pages
  }

  books.push(newBook)
  
  res.status(201).json(newBook);
};