import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    username:         { type: String, required: true, unique: true },
    profileImage:     { type: String, default: '' },
    email:            { type: String, required: true, unique: true },
    password:         { type: String, required: true },
    verified:         { type: Boolean, default: false },


    refreshToken:     { type: String },
    verifieCode:       { type: String },
    verifieCodeExpiry: { type: Date   },
  },
  { timestamps: true }
);

// 1) Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 2) Password comparison helper
userSchema.methods.matchPassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// 3) JWT instance methods
userSchema.methods.getAccessToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_ACSSES_TOKEN,
    { expiresIn: process.env.JWT_SECRET_ACSSES_TOKEN_EXPARY }
  );
};

userSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_REFRESH_TOKEN,
    { expiresIn: process.env.JWT_SECRET_REFRESH_TOKEN_EXPARY }
  );
};

export default mongoose.model('User', userSchema);
