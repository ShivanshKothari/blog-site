import { Blog } from "../models/blogsData.js";
import { draftBlog } from "../models/draftBlogs.js";
import uploadImage from "../utilities/uploadImage.js";

// Editor controller function (handles editor routing)
export const editorController = async (req, res) => {
  // Check if user is logged in
  if (req.session.authorized) {
    const pageProps = {
      author: req.session.user.email,
      lastPath: req.params.lastPath,
      editorCSS: "/stylesheets/editor.css",
    };
    // Check if existing post is to be edited
    const blogData = await Blog.findOne({ url: req.params.lastPath });
    if (req.params.lastPath === "new-post") {
      res.render("editor", pageProps);
    } else if (blogData) {
      blogData.post_text = blogData.post_text.replaceAll("<br>", "\n");
      pageProps["blogData"] = blogData;
      res.render("editor", pageProps);
    } else res.redirect("/404");
  } else res.redirect("/u");
};

// Publish post controller (Requests to 'Publish a new blog post' or 'Edit a blog post').
export const publishController = async (req, res) => {
  if (req.session.authorized) {
    let imageUrl, tags;
    
    if (req.headers.referer.split("/")[4] === "new-post") {
      console.log(req.files.image_path)
      if (req.files.image_path) {
        const file = {
          type: req.files.image_path.mimetype,
          buffer: req.files.image_path.data,
        };
        imageUrl = await uploadImage(file, "single");
      } else {
        imageUrl = "/images/1.png";
      }
      if (req.body.tags.split(",").length >= 1) {
        tags = req.body.tags.split(",");
      } else {
        tags = [];
      }
      let postUrl = encodeURIComponent(req.body.heading.trim());
      if (await Blog.findOne({ url: postUrl }) || await draftBlog.findOne({ url: postUrl })) {
        postUrl += "v";
      }
      
      // Create postUrl from post title/heading
      const draftBlogData = {
        url: postUrl,
        image_path: imageUrl,
        heading: req.body.heading,
        email: req.session.user.email,
        post_text: req.body.post_text.replaceAll("\n", "<br>"),
      }
      if (tags.length > 0)
      draftBlogData.tags = tags;
    await draftBlog.create(draftBlogData);
  } else {
    const existingBlog = await Blog.findOne({
      url: req.headers.referer.split("/")[4],
    });
    if (existingBlog) {
        // Upload image if exists or set default image path
        if (req.files.image_path) {
          const file = {
            type: req.files.image_path.mimetype,
            buffer: req.files.image_path.data,
          };
          console.log(file,"arst");
          imageUrl = await uploadImage(file, "single");
        } else {
          imageUrl = "/images/1.png";
        }
        if (req.body.tags.split(",").length >= 1) {
          tags = req.body.tags.split(",");
        } else {
          tags = [];
        }
        const draftBlogData = {
          url: existingBlog.url,
          heading: req.body.heading,
          email: req.session.user.email,
          tags: tags.concat(existingBlog.tags),
          post_text: req.body.post_text.replaceAll("\n", "<br>"),
        };
        if (imageUrl !== "/images/1.png") draftBlogData.image_path = imageUrl;
        await draftBlog.create(draftBlogData);
      }
    }
  res.redirect('/u')
  }
};
