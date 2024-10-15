import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  //   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { 
    type: String, 
    required: [true, "name is required"] 
    },

  email: { 
    type: String, 
    required: [true, "email is required"], 
    unique: true 
    },

  role: { 
    type: String, 
    required: true 
    },

  password: { 
    type: String, 
    required: [true, "password is required"] 
    },

  isVerified: {
    type: Boolean,
    default: false
  },

  isBlacklisted: {
    type: Boolean,
    default: false
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
    },

  updatedAt: { 
    type: Date, 
    default: Date.now 
    },

});

const User = mongoose.model("User", userSchema);

export default User;
