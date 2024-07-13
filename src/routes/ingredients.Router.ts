import express from "express";

import {
  getIngredients,
  ingredientsSearch,
  nutrientsByIngredient,
} from "../controllers/ingredientsController";

const router = express.Router();

router.get("/", getIngredients);
router.get("/search-ingredients/:search", ingredientsSearch);
router.get("/ingredient-nutrients/:id", nutrientsByIngredient);

export { router as ingredientsRouter };
