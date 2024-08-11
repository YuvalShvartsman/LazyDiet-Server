import express from "express";

import { saveMeals } from "../controllers/mealsController";

const router = express.Router();

router.post("/", saveMeals);

export { router as mealsRouter };
