import { Blog } from "../models/blogsData.js";
import { User } from "../models/userData.js";
import { OTP } from "../models/OTP.js";
import bcrypt from "bcrypt";
import { generateOTP } from "../utilities/generationFunctions.js";
import { sendOTP } from "../utilities/mailFunctions.js";

// Dashboard / Login controller function (Shows dashboard if logged in and Log in page if not)
export const loginController = async (req, res) => {
  // Prepare page data for rendering
  const pageData = {
    title: "User Login",
    loggedIn: req.session.authorized, // To show user icon if logged in
  };

  console.log("User authorized at login route:", req.session.authorized);

  // Check if user is already logged in
  if (req.session.authorized) {
    console.log("User already logged in, redirecting to dashboard");

    // Initializing CSS path and page title
    pageData["title"] = "Dashboard | " + req.session.user.email;
    pageData["dashboardCSS"] = "/stylesheets/dashboard.css";
    pageData["indexCSS"] = "/stylesheets/index.css";

    // Fetch all posts and change url to 'u/edit/*' to reach editor route
    const postTiles = await Blog.find({})
      .select("image_path heading url")
      .sort({ id: -1 })
      .skip(parseInt(req.query.page) * 10 || 0)
      .limit(10);
    postTiles.forEach((postTile) => {
      postTile.url = "edit/" + postTile.url;
    });
    pageData["postTiles"] = postTiles;

    // Render dashboard page
    res.render("dashboard", pageData);
  } else {
    // Handle potential login error message
    
    pageData["warning"] = req.query["cred-error"] === "error" ? "Incorrect username or password ¬_¬" : '';
    
    pageData.loginCSS = "/stylesheets/login.css";

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
    const userAuthorized = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // Check if password matches
    if (userAuthorized) {
      // Set session data for logged-in user
      req.session.user = user;
      req.session.authorized = true;
      if (user.role === "admin") {
        console.log("Admin logged in");
        req.session.isAdmin = true;
      }
      console.log(
        "User authorized at credentials submit:",
        req.session.authorized
      );

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

// Logout controller function (handles logout)
export const logoutController = async (req, res) => {
  // Destroy session data for logged-in user
  req.session.destroy((e) => {
    console.log("Logout error", e.message);
  });
  // Redirect to home page
  res.redirect("/");
};

// Signup controller function (handles signup attempt)
export const signupController = async (req, res) => {
  const pageData = {
    title: "Signup",
    loginCSS: "/stylesheets/login.css",
  };
  res.render("login", pageData);
};

// Verification controller function (handles 'Account Verification' and 'Forgot Password')
export const signupSubmitController = async (req, res) => {
  
  if (req.session.OTPVerified){
    await User.create(req.session.tempUser);
    req.session.tempUser = null;
    req.session.OTPVerified = false;
    res.redirect("/u");
  }
  else {
    res.redirect('/');
  }
  console.log("Reached signup submit controller");
};

// Verification controller function (handles 'Account Verification' and 'Forgot Password')
export const verifyController = async (req, res) => {
  
  if (req.params.lastPath === "account"){
    sendOTP(req.body.email, await generateOTP(req.body.email));
    await bcrypt.hash(req.body.password, 15)
    .then((hashedPassword) => {
    req.session.tempUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword
    }
    });
    const pageData = {
      loginCSS: "/stylesheets/login.css",
      title: "Verify Account",

    };
    res.render('login', pageData);
  }
  else if (req.params.lastPath === "forgot-password"){
    const pageData = {
      loginCSS: "/stylesheets/login.css",
      title: "Forgot password",
    };
    res.render('login', pageData);
  }
};

// Email Validation controller function (handles email validation/uniqueness generally over ajax)
export const redundantEmailValidationController = async (req, res) => {
  const email = req.body.email.trim(); // Trim leading/trailing whitespace
  req.session.userEmail = req.body.email.trim();

  // Check if email exists in database
  try {
    // Check if cname already exists in the database
    const existingUser = await User.findOne({ email: email});

    if (existingUser) {
      res.json({ isValid: false, message: "Email already exists" });
     if (req.body.requestSource){
      sendOTP(email, generateOTP(email));
      console.log("Otp generated successfully");
     }
      // Generate OTP if email validation is used from forgot password page

    } else {
      res.json({ isValid: true, message: "Email is not taken" });
    }
  } catch (err) {
    console.error("/validate error:", err);
    res.status(500).json({ isValid: false, message: "Internal server error" });
  }
};

// OTP verification controller function (handles OTP verification generally over ajax)
export const verifyOTPController = async (req, res) => {

  try {
    // Check if OTP exists in the database
    const validOTP = await OTP.findOne({ 
      email: req.session.userEmail, 
      otp: req.body.otp.trim()
    });

    if (validOTP) {
      res.json({ isValid: true, message: "OTP verified." });
      req.session.OTPVerified = true;
    } else {
      req.session.OTPVerified = true;
      res.json({ isValid: false, message: "Wrong OTP" });
    }
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ isValid: false, message: "Internal server error" });
  
  }
};
