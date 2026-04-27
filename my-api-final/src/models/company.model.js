// src/models/company.model.js
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The company\'s owner is required']
    },
    name: {
      type: String,
      required: [true, 'The company\'s name is required']
    },
    cif: {
      type: String,
      required: [true, 'The company\'s CIF is required']
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: [true, 'The company\'s address is required']
    },
    logo: {
      type: String
    },
    isFreelance: {
      type: Boolean,
      required: [true, 'The company\'s status is required']
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
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;