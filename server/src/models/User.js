import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Invalid email']
    },
    password: { type: String, minlength: 8, select: false },
    avatar: String,
    role: { type: String, enum: ['user', 'organizer', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    tokenVersion: { type: Number, default: 0 },
    resetPasswordHash: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
