import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  //   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already in use"]
  },

  role: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  phone: {
    type: String,
    required: [true, "Phone Number is required"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isBlacklisted: {
    type: Boolean,
    default: false,
  },

  refreshToken: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
