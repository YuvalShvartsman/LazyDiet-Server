import { Request, Response } from "express";
import MealTypes from "../models/MealTypes";

export const getMealTypes = async (req: Request, res: Response) => {
  try {
    const mealTypes = await MealTypes.find();
    console.log("🚀 ~ getMealTypes ~ mealTypes:", mealTypes);
    res.json({ data: mealTypes });
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .send(
        "A problem occured while trying to get meal types from the server."
      );
  }
};
