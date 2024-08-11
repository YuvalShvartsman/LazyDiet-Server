import { Request, Response } from "express";

import { IMeal, Meals } from "../models/Meals";
import { Ingredient, IIngredient } from "../models/Ingredients";

import { ObjectId } from "mongodb";

type Macros = { amount: number; name: string; _id: ObjectId };

const getMealMacros = (
  ingredient: IIngredient | null,
  amountInGrams: number,
  mealMacros: Macros[]
): Macros[] => {
  if (!ingredient || !ingredient.nutrientValues) return mealMacros;

  const newMacros = ingredient.nutrientValues.map((nutrient) => ({
    amount: (nutrient.amount * amountInGrams) / 100,
    name: nutrient.nutrientName.name,
    _id: nutrient.nutrientName._id as ObjectId,
  }));

  return newMacros.reduce((arr, macro) => {
    const existIndex = arr.findIndex((m) => m._id.equals(macro._id));
    if (existIndex !== -1) {
      arr[existIndex].amount += macro.amount;
    } else {
      arr.push(macro);
    }
    return arr;
  }, mealMacros);
};

export const saveMeals = async (req: Request, res: Response) => {
  const { userId, meals } = req.body;

  try {
    const createdMeals = await Promise.all(
      meals.map(async (mealToCreate: IMeal) => {
        let createdMealMacros: Macros[] = [];

        await Promise.all(
          mealToCreate.ingredients.map(async (ingredientData) => {
            const ingredient = await Ingredient.findById(
              ingredientData.ingredient
            )
              .populate({
                path: "nutrientValues",
                populate: {
                  path: "nutrientName",
                  model: "nutrientsNames",
                },
              })
              .lean({ vitruals: true });

            createdMealMacros = getMealMacros(
              ingredient,
              ingredientData.amount,
              createdMealMacros
            );
          })
        );

        return Meals.create({
          ...mealToCreate,
          userId,
          macros: createdMealMacros,
        });
      })
    );

    res.json({ data: { createdMeals } });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error: Could not save your meal.");
  }
};
