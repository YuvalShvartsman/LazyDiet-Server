import { Request, Response } from "express";

import { IMeal, Meals } from "../models/Meals";

import { Ingredient, IIngredient } from "../models/Ingredients";

const getMealMacros = (
  ingredient: IIngredient | null,
  amountInGrams: number,
  mealMacros:{amount:number, name:string , _id:string}[]
) => {
  const macros:{amount:number, name:string , _id:string}[] = ingredient?.nutrientValues?.map((nutrient) => {
    {
      return {
        amount: (nutrient.amount * amountInGrams) / 100, // 6 grams of protein in 100 grams mean 6 grams not 600 :D
        name: nutrient.nutrientName.name,
        _id:nutrient.nutrientName._id
      };
    }
  });
  mealMacros.map((oldMacro)=>{return oldMacro.amount + (macros ? (macros?.map((macro)=>macro._id).find(macros._id).):0) 
    
  })

  console.log(macros);
  return mealMacros
};

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
      let createdMealMacros:{amount:number, name:string , _id:string}[] = [];

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
          createdMealMacros =  getMealMacros(ingredient, createdMeal.ingredients[i].amount ,createdMealMacros);

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
