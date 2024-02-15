// models/users.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
  // Add other fields as needed
});

const Blog = mongoose.model('users', userSchema);

export default Blog;
