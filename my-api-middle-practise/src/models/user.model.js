// src/models/user.model.js
import mongoose from 'mongoose';

const opts = { toJSON: { virtuals: true } };

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      index: true,
      required: [true, 'The email is required']
    },
    password: {
      type: String,
      required: [true, 'The password is required']
    },
    name: {
      type: String,
      required: [true, 'The name is required']
    },
    lastname: {
      type: String,
      required: [true, 'The lastname is required']
    },
    nif: {
      type: String,
      required: [true, 'The NIF is required']
    },
    role: {
      type: String,
      enum: ['admin', 'guest'],
      index: true,
      default: 'admin'
    },
    status: {
      type: String,
      enum: ['pending', 'verified'],
      index: true,
      default: 'pending'
    },
    verificationCode: {
      type: String,
      default: String(Math.floor(100000 + Math.random() * 900000))
    },
    verificationAttempts: {
      type: Number,
      default: 0,
      max: [3, 'Too many failed attempts']
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      index: true
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'
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
    versionKey: false   
  },
  opts
);

userSchema.virtual('fullName').get(function() {
  return this.name + ' ' + this.lastname;
});

const User = mongoose.model('User', userSchema);

export default User;