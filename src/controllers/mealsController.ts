import { Request, Response } from "express";

import { IUser } from "../models/Users";
import { IMeal, Meals } from "../models/Meals";

interface SaveMealsRequest extends Request {
  body: {
    user: IUser;
    meals: IMeal;
  };
}

export const saveMeals = async (req: SaveMealsRequest, res: Response) => {
  const { user, meals } = req.body;
  console.log("🚀 ~ saveMeals ~ meals:", meals);
  console.log("🚀 ~ saveMeals ~ u:", user);
  const createdMeal = Meals.create({ user, meals });
  try {
    res.json({ data: { createdMeal } });
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid token");
  }
};
