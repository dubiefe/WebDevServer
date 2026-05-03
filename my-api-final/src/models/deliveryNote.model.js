// src/models/client.model.js
import mongoose from 'mongoose';

const deliveryNoteSchema = new mongoose.Schema(
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
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
      required: [true, 'The project is required']
    },
    format: {
      type: String,
      enum: ['material', 'hours'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'The description is required']
    },
    workDate: {
      type: Date,
      default: Date.now()
    },
    // Format 'material'
    material: {
      type: String,
      required: function () {
        return this.format === 'material';
      }
    },
    quantity: {
      type: Number,
      required: function () {
        return this.format === 'material';
      }
    },
    unit: {
      type: String,
      required: function () {
        return this.format === 'material';
      }
    },
    // Format 'hours'
    hours: {
      type: Number,
      required: function () {
        return this.format === 'hours';
      }
    },
    workers: [
      {
        name: {
            type: String,
            required: true
        },
        hours: {
            type: Number,
            required: true
        }
      }
    ],
    // Signature
    signed: {
      type: Boolean,
      default: false
    },
    signedAt: {
      type: Date
    },
    signatureData: {
      type: String
    },
    pdfPath: {
      type: String
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

const DeliveryNote = mongoose.model('DeliveryNote', deliveryNoteSchema);

export default DeliveryNote;