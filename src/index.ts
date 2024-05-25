import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import jwt from "express-jwt";

import dotenv from "dotenv";

import routes from "./routes";

const JWT_SECRET = process.env.JWT_SECRET!;

const app = express();
const port = 3000;

dotenv.config();

app.use(bodyParser.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Your React app's URL
    credentials: true,
  })
);

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "kilter-board",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

app.use(routes);

try {
  mongoose.connect("mongodb://localhost:27017/LazyDiet").then(() => {
    console.log("established connection to mongodb");
  });
} catch (error) {
  console.log("could not establish connection to mongodb", error);
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
