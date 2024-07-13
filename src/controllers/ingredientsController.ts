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

export const ingredientsSearch = async (req: Request, res: Response) => {
  const { search } = req.params;
  try {
    const ingredients = await Ingredient.find({
      ingredient_description: { $regex: search as string, $options: "i" },
    }).limit(10);
    res.json(ingredients);
  } catch (error) {
    res.status(500).send(error);
    console.log(
      "Error! There has been a problem in fetching ingredients. error -  ",
      error
    );
  }
};

export const nutrientsByIngredient = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("🚀 ~ nutrientsByIngredient ~ id:", id);
  try {
    // const ingredient = await Ingredient.findById(id).populate({
    //   path: "nutrients",
    //   match: { fdc_id: "fdc_id" },
    //   populate: {
    //     path: "nutrientsNames",
    //     model: "nutrientsNames",
    //   },
    // });
    const ingredient = await Ingredient.findById(id);
    const nutrientsValues = await nutrients.find({
      fdc_id: ingredient?.fdc_id,
    });
    console.log(
      "🚀 ~ nutrientsByIngredient ~ nutrientsValues:",
      nutrientsValues
    );
    console.log("🚀 ~ nutrientsByIngredient ~ ingredient:", ingredient);

    res.json(ingredient);
  } catch (error) {
    res.status(500).send(error);
    console.log(
      "Error! There has been a problem in fetching ingredients. error -  ",
      error
    );
  }
};
