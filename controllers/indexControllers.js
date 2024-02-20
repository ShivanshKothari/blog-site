import { Blog} from "../models/blogsData.js";

export const homeController = async (req, res, next) => {
  try {
    const data = {
      title: "Home | Blogster",
      postTiles: await Blog.find()
        .select("image_path url heading")
        .sort({ id: -1 }),
      homeCSS: "y",
      loggedIn: req.session.authorized
    };
    res.render("index", data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}


