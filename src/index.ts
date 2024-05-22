import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";

import dotenv from "dotenv";

import routes from "./routes";

const app = express();
const port = 3000;

dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json());

app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
