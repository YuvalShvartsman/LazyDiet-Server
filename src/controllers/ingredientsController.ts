import { Request, Response } from "express";
import { Ingredient } from "../models/Ingredients";

export const getIngredients = async (req: Request, res: Response) => {
  res.json("not in use as for now");
  // let page = 1;
  // let hasMoreData = true;

  // let ingredientsWithNutrients = [];

  // while (hasMoreData) {
  //   try {
  //     const ingredients = await Ingredient.find();

  //     if (ingredients.length > 0) {
  //       console.log(
  //         `Processing page ${page} with ${ingredients.length} ingredients`
  //       );

  //       ingredients.forEach(async (ingredient) => {
  //         const ingredientsNutrients = await Nutrients.find({
  //           fdc_id: ingredient.fdc_id,
  //         });
  //         ingredientsWithNutrients.push({ ingredient, ingredientsNutrients });
  //         console.log(ingredientsWithNutrients);
  //       });

  //       page++;
  //     } else {
  //       hasMoreData = false;
  //     }
  //     res.json(ingredients);
  //   } catch (err) {
  //     console.error("Error in query:", err);
  //     hasMoreData = false;
  //   }
  // }
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

  res.json("non functional function :D");
};
