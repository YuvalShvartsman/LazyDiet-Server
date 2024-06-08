import express from "express";
import { getSenitivities } from "../controllers/sensitivitiesController";

const router = express.Router();

router.get("/", getSenitivities);

export { router as sensitivitiesRouter };
