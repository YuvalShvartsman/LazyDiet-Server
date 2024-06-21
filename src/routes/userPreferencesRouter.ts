import express from "express";
import {
  saveUserPreferences,
  getUserPreferencesOptions,
  getPreferencesByUser,
} from "../controllers/userPreferencesController";

const router = express.Router();

router.get("/preferencesByUser/:userId", getPreferencesByUser);
router.get("/preferencesOptions", getUserPreferencesOptions);

router.post("/", saveUserPreferences);

export { router as userPreferencesRouter };
