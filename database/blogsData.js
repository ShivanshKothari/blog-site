import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    url: String,
    image_path: String,
    heading: String,
    author_name: String,
    date_created: Date,
    last_modified: Date,
    tags: [String],
    post_text: String,
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
