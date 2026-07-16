import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId, // for nested replies
      ref: 'Comment',
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
