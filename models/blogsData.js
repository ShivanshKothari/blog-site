import mongoose from 'mongoose';

const blogDataSchema = new mongoose.Schema({
    id: Number,
    url: {
        type: String,
        required: true
    },
    image_path: {
        type: String,
        default: "/images/1.png"
    },
    heading: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: "admin"
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
    tags: {
        type: [String],
        required: true,
        default: ["myvedicjourney"]
    },
    post_text: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0,
    }
});

blogDataSchema.pre('save', async function (next) {
    try {
        if (!this.isNew) { // Check if the document is being created for the first time
            return next();
        }

        const count = await this.constructor.countDocuments(); // Count the number of documents in the collection
        this.id = count + 1; // Set the _id field to the next incrementing value
        next();
    } catch (error) {
        next(error);
    }
});

export const Blog = mongoose.model('blogDatas', blogDataSchema);

// export const blogPosts = Blog.find();
// export const postTiles = Blog.find().select('image_path url heading');

