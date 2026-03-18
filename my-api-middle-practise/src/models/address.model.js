// src/models/address.model.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: [true, 'The street is required']
    },
    number: {
      type: String,
      required: [true, 'The number is required']
    },
    postal: {
      type: String,
      required: [true, 'The postal is required']
    },
    city: {
      type: String,
      required: [true, 'The city is required']
    },
    province: {
      type: String,
      required: [true, 'The province is required']
    },
  },
  {
    timestamps: true,   
    versionKey: false   
  }
);

const Address = mongoose.model('Address', addressSchema);

export default Address;