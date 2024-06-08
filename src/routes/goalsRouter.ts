import express from "express";
import { getGoals } from "../controllers/goalsController";

const router = express.Router();

router.get("/", getGoals);

export { router as goalsRouter };
