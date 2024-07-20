import { Request, Response } from "express";

import { IMeal, Meals } from "../models/Meals";

import { Ingredient } from "../models/Ingredients";

export const saveMeals = async (req: Request, res: Response) => {
  const { userId, meals } = req.body;
  try {
    let createdMeals = [];
    for (let i = 0; i < meals.length; i++) {
      const mealToCreate: IMeal = meals[i];
      const createdMeal = await Meals.create({
        ...{ userId },
        ...mealToCreate,
      });
      for (let i = 0; i < createdMeal.ingredients.length; i++) {
        const ingredientId = createdMeal.ingredients[i].ingredient;
        const ingredient = await Ingredient.findById(ingredientId)
          .populate({
            path: "nutrientValues",
            populate: {
              path: "nutrientName",
              model: "nutrientsNames",
            },
          })
          .lean({ vitruals: true });
        console.log(ingredient);
      }

      createdMeals.push(createdMeal);
    }
    res.json({ data: { createdMeals } });
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid token");
  }
};
