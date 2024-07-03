import { Request, Response } from "express";
import Ingredients from "../models/Ingredients";
import Nutrients from "../models/Nutrients";
import NutrientsNames from "../models/NutrientsNames";

export const getIngredients = async (req: Request, res: Response) => {
  try {
    const ingredients = await Ingredients.find().populate({
      path: "nutrients",
      populate: {
        path: "nutrient_name",
        model: "nutrientsNames", // Populate the nutrient_name field with data from NutrientsNames collection
        select: "name nutrient_id", // Select fields you want to include
      },
    });
    res.json({ data: ingredients });
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .send(
        "A problem occured while trying to get diet types from the server."
      );
  }
};
