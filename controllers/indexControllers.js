import { Blog } from "../models/blogsData.js";

// Home controller function (handles homepage rendering)
export const homeController = async (req, res, next) => {
  try {
    // Fetch all blog posts in descending order to get latest blog posts
    const data = {
      title: "Home | Blogster",
      postTiles: await Blog.find()
        .select("image_path url heading")
        .sort({ id: -1 }),
      homeCSS: "y", // Flag for applying specific CSS to homepage
      loggedIn: req.session.authorized, // To show user icon if logged in
    };

    // Render the homepage template with data
    res.render("index", data);
  } catch (error) {
    console.error("Error fetching blog posts:", error); // Log the error message
    res.status(500).send("Internal Server Error"); // Send error response
  }
};
