import { Request, Response } from "express";

import { IMeal, Meals } from "../models/Meals";

import { Ingredient } from "../models/Ingredients";
import { nutrients } from "../models/Nutrients";
import { nutrientsNames } from "../models/NutrientsNames";

// type NutrientName = {
//   _id: string;
//   name: string;
//   nutrient_id: string;
// };

// type Nutrient = {
//   _id: string;
//   calories: number;
//   proteins: number;
//   amount: number;
//   nutrient_id: string;
//   nutrientsName: NutrientName;
// };

// type Ingredient = {
//   _id: string;
//   ingredient_description: string;
//   fdc_id: number;
//   nurtrients?: Nutrient[];
// };

// type Meal = {
//   mealName: string;
//   description?: string;
//   prep?: string;
//   ingredients: { ingredient: Ingredient; amount: number }[];
// };

// interface SaveMealsRequest extends Request {
//   body: {
//     userId: string;
//     meals: IMeal[];
//   };
// }

export const saveMeals = async (req: Request, res: Response) => {
  const { userId, meals } = req.body;
  // console.log("🚀 ~ saveMeals ~ meals:", meals);

  // const ingredientsIds = meals.map((meal: any) =>
  //   meal.ingredients.map((ing: any) => ing.ingredient._id)
  // );
  // console.log("🚀 ~ saveMeals ~ ingredientsIds:", ingredientsIds);

  // for (let i = 0; i < ingredientsIds.length; i++) {
  //   const nutrients = await Ingredient.find({
  //     _id: ingredientsIds[i],
  //   }).populate({
  //     path: "Nutrient",
  //     match: { fdc_id: "fdc_id" },
  //     populate: {
  //       path: "nutrientsNames",
  //       model: "nutrientsNames",
  //     },
  //   });
  //   console.log("ingredient with nutrients - ", nutrients);

  try {
    let createdMeals = [];
    for (let i = 0; i < meals.length; i++) {
      const mealToCreate: IMeal = meals[i];
      const createdMeal = await Meals.create({
        ...{ userId },
        ...mealToCreate,
      });
      // console.log("created meal is - ", createdMeal);
      for (let i = 0; i < createdMeal.ingredients.length; i++) {
        const ingredientId = createdMeal.ingredients[i].ingredient;
        console.log("🚀 ~ ingredientId:", ingredientId);

        const ingredient = await Ingredient.findById(ingredientId);
        const ingredientsNutrients = await nutrients
          .find({
            fdc_id: ingredient?.fdc_id,
          })
          .populate("nutrientName")
          .lean({ virtuals: true });

        console.log("🚀 ~ ingredientsNutrients:", ingredientsNutrients);

        // const nutrientWithNames = await nutrientsNames.find({
        //   nutrient_id: ingredientsNutrients.map(
        //     (nutrient) => nutrient.nutrient_id
        //   ),
        // });
        // console.log("🚀 ~ nutrientWithNames:", nutrientWithNames);
      }

      createdMeals.push(createdMeal);
    }
    res.json({ data: { createdMeals } });
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid token");
  }
};
