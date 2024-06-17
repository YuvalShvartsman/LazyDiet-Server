import express from "express";
import {
  saveUserPreferences,
  getUserPreferencesOptions,
} from "../controllers/userPreferencesController";

const router = express.Router();

router.get("/preferencesOptions", getUserPreferencesOptions);

router.post("/", saveUserPreferences);

export { router as userPreferencesRouter };
