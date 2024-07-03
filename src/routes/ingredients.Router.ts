import express from "express";

import { getIngredients } from "../controllers/ingredientsController";

const router = express.Router();

router.get("/", getIngredients);

export { router as ingredientsRouter };
