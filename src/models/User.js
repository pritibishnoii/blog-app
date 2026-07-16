import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String, // hashed with bcrypt before save (Phase 3)
      required: true,
    },
    avatar: {
      type: String, // Cloudinary URL
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
