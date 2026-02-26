//import { books } from '../data/books.js';
import Book from "../models/books.model.js";

// GET /api/books
export const getAll = async (req, res) => {
  let results;
  const { author, year, pages } = req.query;

  const filter = {};

  if(author) {
    filter.author = author;
  }
  if(!isNaN(year)) {
    filter.year = year;
  }
  if(!isNaN(pages)) {
    filter.pages = pages
  }

  results = await Book.find(filter);   
  
  if(!results || results.length === 0) {
    res.status(404).json({ error: 'No correspondances' });
  }
  res.json(results);
};

// GET /api/books/:id
export const getById = async (req, res) => {
  const id = req.params.id;
  const results = await Book.find({id:id});

  if(!results || results.length === 0) {
    res.status(404).json({ error: 'Book not found' });
  }
  res.json(results[0]);
};

// POST /api/books
export const post = async (req, res) => {
  const { id, title, author, year, pages } = req.body;

  const newBook = await Book.create({ id: id, title: title, author: author, year: year, pages: pages });
  
  res.status(201).json({message: "Book n°" + id + " created", content: newBook});
};

// PUT /api/books/\:id
export const put = async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await Book.find({id:id});

  if(!results || results.length === 0) {
    res.status(404).json({ error: 'Book not found' });
  }

  const { title, author, year, pages } = req.body;
  const attributes = { title, author, year, pages };

  const book = await Book.findByIdAndUpdate(results[0]._id, attributes, { new: true });

  res.status(200).json({ message: 'book n°' + id + ' fully updated', content: book });
}

// PATCH /api/books/\:id
export const patch = async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await Book.find({id:id});

  if(!results || results.length === 0) {
    res.status(404).json({ error: 'Book not found' });
  }

  const { title, author, year, pages } = req.body;
  const attributes = {};

  if(title) {
    attributes.title = title;
  }
  if(author) {
    attributes.author = author;
  }
  if(year) {
    attributes.year = year;
  }
  if(pages) {
    attributes.pages = pages;
  }

  const book = await Book.findByIdAndUpdate(results[0]._id, attributes, { new: true });

  res.status(200).json({ message: 'book n°' + id + ' partially updated', updates: attributes, content: book });
}

// DELETE /api/books/\:id
export const delete_book = async (req, res) => {
  const id = parseInt(req.params.id);
  const results = await Book.find({id:id});

  if(!results || results.length === 0) {
    res.status(404).json({ error: 'Book not found' });
  }

  const book = await Book.findByIdAndDelete(results[0]._id);

  res.status(200).json({ message: 'book n°' + id + ' deleted', content: book });
}