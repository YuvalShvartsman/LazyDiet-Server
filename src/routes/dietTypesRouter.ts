import express from "express";
import { getDietTypes } from "../controllers/dietTypesController";

const router = express.Router();

router.get("/", getDietTypes);

export { router as dietTypesRouter };
