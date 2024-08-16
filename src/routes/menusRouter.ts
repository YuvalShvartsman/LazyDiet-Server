import express from "express";

import {
  createMonthlyMenus,
  getMonthlyMenus,
} from "../controllers/menusController";

const router = express.Router();

router.get("/", getMonthlyMenus);
router.post("/", createMonthlyMenus);

export { router as menusRouter };
