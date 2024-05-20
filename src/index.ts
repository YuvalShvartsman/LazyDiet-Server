import cors from "cors";
import routes from "./routes";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();
const port = 3000;

dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json());

app.use(cors(corsOptions));

app.use(routes);

// try {
//    mongoose.connect('mongodb://localhost:27017/LazyDiet');
// } catch (error) {
//   console.log("could not establish connection to mongodb", error)
// }

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
