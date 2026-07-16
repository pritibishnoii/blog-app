import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String, // SEO-friendly URL, unique
      required: true,
      unique: true,
    },
    content: {
      type: String, // rich text HTML/JSON from Tiptap
      required: true,
    },
    excerpt: {
      type: String, // auto-generated short preview
      default: '',
    },
    coverImage: {
      type: String, // Cloudinary URL
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    readTime: {
      type: Number, // minutes, calculated on publish
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // createdAt + updatedAt
);

// Performance indexes, per TRD
PostSchema.index({ tags: 1 });
PostSchema.index({ title: 'text' });
// note: slug index is created automatically via `unique: true` above

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
