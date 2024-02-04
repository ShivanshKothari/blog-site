// models/users.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  username: String,
  password: String,
  // Add other fields as needed
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
