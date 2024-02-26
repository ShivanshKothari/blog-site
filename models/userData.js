// models/users.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  achievements: {
    type: [String],
    default: ["firstBadge"]
  },
  description: {
    type: String,
    default: function() {
      return this.firstName + " is a new member of The Vedians.";
    },
    maxLength: 255
  }
});

const User = mongoose.model("users", userSchema);

export {User};
