// models/users.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

const User = mongoose.model("users", userSchema);

export {User};
