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
import cron from "node-cron";
import cors from "cors";
import axios from "axios";

import { config } from "dotenv";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV !== "production") {
  const envPath = path.resolve(__dirname, ".env");
  config({ path: envPath });
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
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// Session secret
cron.schedule('0 0 1 * *', () => {
  process.env.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
  console.log('Session secret updated');
});
// const sessionnSecret =
//     now.getDate() === 1
//       ? randomBytes(32).toString("hex")
//       : process.env.SESSION_SECRET;
// process.env.SESSION_SECRET = sessionnSecret;
const corsOptions = {
  origin: '*',
  credentials: true
};
app.use(cors(corsOptions));
// app.set('trust-proxy', 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    proxy: true,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      dbName: 'siteData',
      touchAfter: 24 * 3600, // time period in seconds
      autoRemove: "interval",
      autoRemoveInterval: 10,
    }),
    cookie: {
      name: 'Session',
      maxAge: 2 * 24 * 60 * 60 * 1000,
      secure: true,
      // sameSite: 'none',
      // httpOnly: true,
      path: '/'
    },
  })
);
console.log("Process NODE_ENV: " + process.env.NODE_ENV + "\nProcess CLIENT_URL: " + process.env.CLIENT_URL + "\nCookie secure: " + !(process.env.NODE_ENV !== 'production'));
axios.defaults.withCredentials = true;
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
