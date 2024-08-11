import { Request, Response } from "express";
import MealTypes from "../models/MealTypes";

export const getMealTypes = async (req: Request, res: Response) => {
  try {
    const mealTypes = await MealTypes.find();
    res.json({ data: mealTypes });
  } catch (error) {
    console.log(error);
    res.status(401).send("Server Error: Could not get mealTypes.");
  }
};
