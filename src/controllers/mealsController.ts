import { Request, Response } from "express";

import { IMeal, Meals } from "../models/Meals";

import { Ingredient, IIngredient } from "../models/Ingredients";
import { ObjectId } from "mongodb";

type Macros = { amount: number; name: string; _id: string };

const getMealMacros = (
  ingredient: IIngredient | null,
  amountInGrams: number,
  mealMacros: Macros[]
) => {
  const newMacros: Macros[] | undefined = ingredient?.nutrientValues?.map(
    (nutrient) => {
      {
        return {
          amount: (nutrient.amount * amountInGrams) / 100, // 6 grams of protein in 100 grams mean 6 grams not 600 :D
          name: nutrient.nutrientName.name,
          _id: nutrient.nutrientName._id as string,
        };
      }
    }
  );

  if (newMacros)
    for (let i = 0; i < newMacros.length; i++) {
      const existIndex = mealMacros.findIndex(
        (macro) =>
          new ObjectId(macro._id).toString() ===
          new ObjectId(newMacros[i]._id).toString()
      );
      const newAmount = newMacros[i].amount;
      existIndex !== -1
        ? (mealMacros[existIndex].amount =
            mealMacros[existIndex].amount + newAmount)
        : mealMacros.push({ ...newMacros[i] });
    }

  return mealMacros;
};

export const saveMeals = async (req: Request, res: Response) => {
  const { userId, meals } = req.body;
  console.log("🚀 ~ saveMeals ~ meals:", meals);
  let createdMealMacros: Macros[] = [];
  try {
    let createdMeals = [];
    for (let i = 0; i < meals.length; i++) {
      const mealToCreate: IMeal = meals[i];

      for (let i = 0; i < mealToCreate.ingredients.length; i++) {
        const ingredientId = mealToCreate.ingredients[i].ingredient;

        const ingredient = await Ingredient.findById(ingredientId)
          .populate({
            path: "nutrientValues",
            populate: {
              path: "nutrientName",
              model: "nutrientsNames",
            },
          })
          .lean({ vitruals: true });

        createdMealMacros = [
          ...getMealMacros(
            ingredient,
            mealToCreate.ingredients[i].amount,
            createdMealMacros
          ),
        ];
      }
      const createdMeal = await Meals.create({
        ...{ userId },
        ...mealToCreate,
        macros: createdMealMacros,
      });

      createdMeals.push(createdMeal);
    }
    res.json({ data: { createdMeals } });
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid token");
  }
};
