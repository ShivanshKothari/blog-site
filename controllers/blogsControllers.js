import { Blog } from "../models/blogsData.js";

export const blogController = async (req, res) => {
  const lastPartOfPath = "blog/" + req.params.postPath;
  console.log("stdhnenhdtdhne----", req.path);

  try {
    const data = {
      title: "Home | Blogster",
      blogPost: await Blog.findOne({ url: lastPartOfPath }),
      postTiles: await Blog.find({ url: { $ne: lastPartOfPath } })
        .select("image_path url heading")
        .sort({ id: -1 }),
      path: lastPartOfPath,
    };
    res.render("blog", data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
