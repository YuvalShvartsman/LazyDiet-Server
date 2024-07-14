import { Request, Response } from "express";

import { IUser } from "../models/Users";
import { IMeal, Meals } from "../models/Meals";

interface SaveMealsRequest extends Request {
  body: {
    userId: string;
    meals: IMeal[];
  };
}

export const saveMeals = async (req: SaveMealsRequest, res: Response) => {
  const { userId, meals } = req.body;
  try {
    let createdMeals = [];
    for (let i = 0; i < meals.length; i++) {
      const mealToCreate: IMeal = meals[i];
      const createdMeal = Meals.create({
        ...{ userId },
        ...mealToCreate,
      });
      createdMeals.push(createdMeal);
    }
    res.json({ data: { createdMeals } });
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid token");
  }
};
