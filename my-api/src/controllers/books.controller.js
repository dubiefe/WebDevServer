import { books } from '../data/books.js';

// GET /api/books
export const getAll = (req, res) => {
  let results = [...books];
  const { id, title, author, year, pages } = req.query;

  if(author) {
    results = results.filter(b => b.author === author)
  } 
  if(year && results) {
    results = results.filter(b => b.year === parseInt(year))
  } 
  if(pages && results) {
    results = results.filter(b => b.pages === parseInt(pages))
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
  const { id, title, author, year, pages } = req.body;

  const newBook = {
    id: id,
    title: title,
    author: author,
    year: parseInt(year),
    pages: parseInt(pages)
  }

  books.push(newBook)
  
  res.status(201).json(newBook);
};

// PUT /api/books/\:id
export const put = (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if(!book) {
    res.status(404).json({ error: 'Book not found' });
  }

  const { title, author, year, pages } = req.body;

  book.title = title;
  book.author = author;
  book.year = year;
  book.pages = pages;

  res.status(200).json({ message: 'book n°' + id + ' fully updated' });
}

// PATCH /api/books/\:id
export const patch = (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if(!book) {
    res.status(404).json({ error: 'Book not found' });
  }

  const { title, author, year, pages } = req.body;

  if(title) {
    book.title = title;
  }
  if(author) {
    book.author = author;
  }
  if(year) {
    book.year = year;
  }
  if(pages) {
    book.pages = pages;
  }

  res.status(200).json({ message: 'book n°' + id + ' partially updated' });
}

// DELETE /api/books/\:id
export const delete_book = (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if(!book) {
    res.status(404).json({ error: 'Book not found' });
  }

  const index = books.findIndex(c => c.id === id);
  books.splice(index, 1)

  res.status(200).json({ message: 'book n°' + id + ' deleted', content: book });
}