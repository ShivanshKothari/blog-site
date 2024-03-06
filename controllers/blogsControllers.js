import { Blog } from "../models/blogsData.js";

// Blog controller function (handles blog post display)
export const blogController = async (req, res) => {
  // Extract the blog post path from request parameters
  const postPath = req.params.lastPath;

  console.log("Request path:", req.path); // Log the full request path

  try {
    // Fetch blog post data
    const data = {
      title: "Home | Blogster",
      blogPost: await Blog.findOne({ url: postPath }),
      postTiles: await Blog.find({ url: { $ne: postPath } })
        .select("image_path url heading")
        .sort({ id: -1 }),
      path: postPath,
      loggedIn: req.session.authorized, // To show user icon if logged in
    };

    // Render the blog template with data
    res.render("blog", data);
  } catch (error) {
    console.error("Error fetching blog post:", error); // Log the error message
    res.status(500).send("Internal Server Error"); // Send error response
  }
};

