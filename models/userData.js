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
    default: ["vedian"]
  },
  role: {
    type: String,
    default: "vedian"
  },
  description: {
    type: String,
    default: function() {
      return this.firstName + " is a new member of The Vedians.";
    },
    maxLength: 255
  },
  date_created: {
    type: Date,
    immutable: true,
    default: Date.now(),
  },
  last_modified: {
      type: Date,
      default: Date.now()
  },
});

const User = mongoose.model("users", userSchema);

export {User};
