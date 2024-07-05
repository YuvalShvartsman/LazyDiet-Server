import { Request, Response } from "express";
import { Ingredient } from "../models/Ingredients";
import { nutrients } from "../models/Nutrients";
import { nutrientsNames } from "../models/NutrientsNames";

export const getIngredients = async (req: Request, res: Response) => {
  const pageSize = 100000;
  let page = 1;
  let hasMoreData = true;

  let ingredientsWithNutrients = [];

  while (hasMoreData) {
    try {
      const ingredients = await Ingredient.find();
      // .skip((page - 1) * pageSize)
      // .limit(pageSize)
      // .populate({
      //   path: "nutrients",
      //   match: { fdc_id: "$FDC ID" },
      //   populate: {
      //     path: "nutrientsNames",
      //     // model: "nutrientsNames",
      //   },
      // });

      if (ingredients.length > 0) {
        // Process the ingredients here
        console.log(
          `Processing page ${page} with ${ingredients.length} ingredients`
        );

        // Example processing:
        ingredients.forEach(async (ingredient) => {
          // console.log(ingredient);
          const ingredientsNutrients = await nutrients.find({
            fdc_id: ingredient.fdc_id,
          });
          ingredientsWithNutrients.push({ ingredient, ingredientsNutrients });
          console.log(ingredientsWithNutrients);
        });

        // Move to the next page
        page++;
      } else {
        // No more data
        hasMoreData = false;
      }
      res.json(ingredients);
    } catch (err) {
      console.error("Error in query:", err);
      hasMoreData = false;
    }
  }
};
