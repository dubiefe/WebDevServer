// src/models/book.model.js
import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'The title is required'],
      min: [2, "The title must have at least 2 characters"]
    },
    director: {
      type: String,
      required: [true, 'The director is required']
    },
    year: {
      type: Number,
      min: [1888, "The year must be at least 1888"],
      max: [new Date().getFullYear(), "The year can't be more than current year"]
    },
    genre: {
      type: String,
      enum: ['action','comedy','drama','horror','scifi']
    },
    copies: {
      type: Number,
      default: 5
    },
    availableCopies: {
      type: Number
    },
    timesRented: {
      type: Number,
      default: 0
    },
    cover: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,   
    versionKey: false   
  }
);

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;