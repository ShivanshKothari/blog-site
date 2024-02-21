import createError from "http-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// import cookieParser from 'cookie-parser';
import logger from "morgan";
import mongoose, { mongo } from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { randomBytes } from "crypto";

import { config } from "dotenv";
let cookieSecure = true;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV !== "production") {
  const envPath = path.resolve(__dirname, ".env");
  config({ path: envPath });
  cookieSecure = false;
}

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import blogsRouter from "./routes/blogs.js";

const app = express();

// mongoose db connection setup
mongoose.connect(process.env.DATABASE_URL, {dbName: "siteData"});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("done"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// middleware setup
app.use(logger("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// Session secret
app.use((req, res, next) => {
  const now = new Date();
  process.env.SESSION_SECRET = now.getDate() === 1 && now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0 && now.getMilliseconds() === 0
    ? randomBytes(32).toString("hex")
    : process.env.SESSION_SECRET;

  next();
});
// const sessionnSecret =
//     now.getDate() === 1
//       ? randomBytes(32).toString("hex")
//       : process.env.SESSION_SECRET;
// process.env.SESSION_SECRET = sessionnSecret;


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      touchAfter: 24 * 3600, // time period in seconds
      autoRemove: "interval",
      autoRemoveInterval: 10,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: cookieSecure,
    },
  })
);
app.use(express.static(path.join(__dirname, "public")));

// router setup
app.use("/", indexRouter);
app.use("/u", usersRouter);
app.use("/blog", blogsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
