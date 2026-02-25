// src/models/book.model.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, 'The id is required'],
      unique: true,
      min: [0, "The id can't be negative"]
    },
    title: {
      type: String,
      required: [true, 'The title is required']
    },
    author: {
      type: String
    },
    year: {
      type: Number,
    },
    pages: {
      type: Number,
      required: [true, 'The number of pages is required'],
      min: [1, "Minimum one page"]
    }
  },
  {
    timestamps: true,   
    versionKey: false   
  }
);

const Book = mongoose.model('Book', bookSchema);

export default Book;