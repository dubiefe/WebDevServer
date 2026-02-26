// src/models/book.model.js
import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, 'The id is required'],
      unique: true,
      min: [0, "The id can't be negative"]
    }
  },
  {
    timestamps: true,   
    versionKey: false   
  }
);

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;