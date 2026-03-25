// src/models/storage.model.js
import mongoose from 'mongoose';

const uploadsSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: String,
  url: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

const Uploads = mongoose.model('Uploads', uploadsSchema);
export default Uploads;