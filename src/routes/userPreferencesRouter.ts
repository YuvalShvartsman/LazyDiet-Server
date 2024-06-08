import express from "express";
import { saveUserPreferences } from "../controllers/userPreferencesController";

const router = express.Router();

router.post("/", saveUserPreferences);

export { router as userPreferencesRouter };
