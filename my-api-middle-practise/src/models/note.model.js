// src/models/user.model.js
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'The title is required']
    },
    content: {
      type: String,
      required: [true, 'The content is required']
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'The owner is required']
    }
  },
  {
    timestamps: true,   
    versionKey: false   
  }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;