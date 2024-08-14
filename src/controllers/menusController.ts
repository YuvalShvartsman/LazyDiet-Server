import { Request, Response } from "express";
import MealTypes from "../models/MealTypes";
import Menus from "../models/Menus";
import MonthlyMenus from "../models/MonthlyMenus";

export const getMonthlyMenus = async (req: Request, res: Response) => {
  try {
    const menus = await MonthlyMenus.find()
      .populate({
        path: "users",
        model: "users",
      })
      .populate({ path: "menus", model: "menus" });
    res.json({ data: menus });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error: Could not get your menus.");
  }
};

export const createMonthlyMenus = async (req: Request, res: Response) => {
  try {
    // TODO: create this function.
    const menus = await MonthlyMenus.find()
      .populate({
        path: "users",
        model: "users",
      })
      .populate({ path: "menus", model: "menus" });
    res.json({ data: menus });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error: Could not get your menus.");
  }
};
