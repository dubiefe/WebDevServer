import mongoose from 'mongoose';
import { softDeletePlugin } from '../softDelete.plugin.js';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'The content is required'],
      max: [500, "The content must have maximum 500 characters"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The author is required']
    },
    post : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'The comment must be linked to a post']
    },
    likes: {
        type: Number,
        min: [0, "The number of likes can't be negative"]
    }
  },
  {
    timestamps: true,   
    versionKey: false   
  }
);

commentSchema.plugin(softDeletePlugin);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;