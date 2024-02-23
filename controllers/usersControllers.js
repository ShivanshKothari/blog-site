import { Blog } from "../models/blogsData.js";
import { User } from "../models/userData.js";
import bcrypt from "bcrypt";

// Login controller function
export const loginController = async (req, res) => {
  // Prepare page data for rendering
  const pageData = {
    title: "User Login",
    loginCSS: "/stylesheets/login.css",
    loggedIn: req.session.authorized, // To show user icon if logged in
  };

  console.log("User authorized at login route:", req.session.authorized);

  // Check if user is already logged in
  if (req.session.authorized) {
    console.log("User already logged in, redirecting to post manager");
    // Fetch and render blog posts
    res.render("postmanager", {
      postTiles: await Blog.find({})
        .select("image_path heading url")
        .sort({ id: -1 }),
    });
  } else {
    // Handle potential login error message
    if (req.query["cred-error"] === "error") {
      pageData["warning"] = "Incorrect username or password ¬_¬" ;
    }

    // Render login page with or without error message
    res.render("login", pageData);
  }
};

// Submit controller function (handles login attempt)
export const submitController = async (req, res) => {
  // Find user with matching email
  const user = await User.findOne({ email: req.body.email });

  // Check if user exists
  if (user) {
    // Compare entered password with hashed password
    const userAuthorized = await bcrypt.compare(req.body.password, user.password);

    // Check if password matches
    if (userAuthorized) {
      // Set session data for logged-in user
      req.session.user = user;
      req.session.authorized = true;
      console.log("User authorized at credentials submit:", req.session.authorized);

      // Redirect to homepage after successful login
      res.redirect("./");
    } else {
      // Redirect back to login page with error message
      res.redirect("./?cred-error=error");
    }
  } else {
    // Redirect back to login page with error message if user not found
    res.redirect(`./?cred-error=error`);
  }
};


export const editorController = async (req, res) => {
  const pageProps = {
    author: req.session.user.email,
    lastPath: req.params.lastPath
  };
  res.render('editor', pageProps);

};
