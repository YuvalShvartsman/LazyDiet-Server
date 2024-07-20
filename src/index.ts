import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";

import routes from "./routes";

import "./models/NutrientsNames";
import "./models/Nutrients";

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
