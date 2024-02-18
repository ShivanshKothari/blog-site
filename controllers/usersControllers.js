import { Blog } from "../models/blogsData.js";
import { User } from "../models/userData.js";
import bcrypt from "bcrypt";

export const loginController = async (req, res) => {
  const pageData = { title: "User Login"};
  console.log(req.session.authorized);
  if (req.session.authorized){

    console.log("User Login");
    res.render("postmanager", {
      postTiles: await Blog.find({})
      .select("image_path heading url")
      .sort({ id: -1 }),
    });
  }
  else {
    if (req.query["cred-error"] === "error") {
      pageData["warning"] = "Incorrect username or password ¬_¬";
    }
    res.render("login", pageData);
  }
};

export const submitController = async (req, res) => {
  
  const user = await User.findOne({email:req.body.email});
  // await console.log("Reached submit");
  if (user) {
    const userAuthorized = await bcrypt.compare(req.body.password, user.password);
    if (userAuthorized){
      
      req.session.user = user;
      req.session.authorized = true;
      console.log("User authorized");
      res.redirect('./');
    }
    else res.redirect('./?cred-error=error');

  } else res.redirect(`./?cred-error=error`);
};
