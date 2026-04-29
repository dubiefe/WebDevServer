// src/models/project.model.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: [true, 'The user is required']
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      index: true,
      required: [true, 'The company is required']
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      index: true,
      required: [true, 'The client is required']
    },
    name: {
      type: String,
      required: [true, 'The name is required']
    },
    projectCode: {
      type: String,
      unique: true,
      required: [true, 'The projectCode is required']
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: [true, 'The address is required']
    },
    email: {
      type: String,
      required: [true, 'The email is required']
    },
    notes: {
      type: String
    },
    active: {
      type: Boolean
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    timestamps: true,   
    versionKey: false,
    toJSON: { virtuals: true }   
  },
);

const Project = mongoose.model('Project', projectSchema);

export default Project;