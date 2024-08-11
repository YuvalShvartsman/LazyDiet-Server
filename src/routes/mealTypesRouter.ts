import express from "express";
import { getMealTypes } from "../controllers/mealTypesController";

const router = express.Router();

router.get("/", getMealTypes);

export { router as mealTypesRouter };
