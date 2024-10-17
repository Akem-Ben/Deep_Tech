import mongoose from "mongoose";


export enum Roles {
  Admin = "Admin",
  User = "User",
  Vendor = "Vendor"
}
const userSchema = new mongoose.Schema({

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
    enum: Object.values(Roles),
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

  noOfShops: {
    type: Number,
    default: 0,
  },

  isBlacklisted: {
    type: Boolean,
    default: false,
  },

  refreshToken: {
    type: String,
    default: ''
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
