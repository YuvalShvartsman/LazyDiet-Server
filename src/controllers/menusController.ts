import { Request, Response } from "express";

import { IUserPreferences } from "../models/UserPreferences";
import { IMeal, Meals } from "../models/Meals";

import MonthlyMenus from "../models/MonthlyMenus";
import Menus, { Macros } from "../models/Menus";
import Goals from "../models/Goals";
import { Types } from "mongoose";

type MacrosDistribution = {
  Breakfast?: number;
  Lunch?: number;
  Dinner?: number;
};

export const getMonthlyMenus = async (req: Request, res: Response) => {
  try {
    const menus = await MonthlyMenus.find()
      .populate({
        path: "users",
        model: "users",
      })
      .populate({ path: "menus", model: "menus" });
    res.json({ data: menus });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error: Could not get your menus.");
  }
};

export const createMonthlyMenus = async (req: Request, res: Response) => {
  try {
    const userPreferences: IUserPreferences = req.body;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

    const menus = [];

    const hasMonthlyPlan = await MonthlyMenus.exists({
      month: currentMonth + 1,
      year: currentYear,
    });

    if (!hasMonthlyPlan) {
      for (let day = currentDate.getDate(); day <= lastDay; day++) {
        // For now random meals.
        const randomMeal = await Meals.aggregate([{ $sample: { size: 1 } }]);

        if (randomMeal.length === 0) {
          return res.status(404).send("No meals found.");
        }

        const menu = new Menus({
          menu: {
            meals: [randomMeal[0]._id],
            day: day,
            macros: randomMeal[0].macros,
          },
        });

        await menu.save();
        menus.push(menu._id);
      }

      const monthlyMenu = await MonthlyMenus.create({
        userId: userPreferences.userId,
        month: currentMonth + 1,
        year: currentYear,
        menus,
      });

      await monthlyMenu.save();
      res.json({ data: monthlyMenu });
    } else {
      res.json({ data: "The user already has a plan for this month." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error: Could not create a menu for you.");
  }
};

// Helper functions:

const createMenu = async (userPreferences: IUserPreferences, day: number) => {
  const initialMenu = new Menus({
    menu: {
      meals: [],
      day: day,
      macros: [],
    },
  });

  const menuMacros = await findMenuMacros(userPreferences);

  if (menuMacros) {
    const meals = await findMealsForMenu(userPreferences, menuMacros);
  } else return false;
};

const findMenuMacros = async (userPreferences: IUserPreferences) => {
  try {
    const goal = await Goals.findOne({ _id: userPreferences.goal });

    if (goal) {
      const menuMacros: Macros[] = goal.multipliers.map((macro) => {
        return {
          amount: macro.multiplier * Number(userPreferences.weight),
          _id: macro.macro as unknown as Types.ObjectId, // Ensuring _id is Types.ObjectId
        };
      });
      return menuMacros;
    } else return false;
  } catch (error) {
    console.log("Error finding macros for this menu, Error: ", error);
  }
};

const findMealsForMenu = async (
  userPreferences: IUserPreferences,
  menuMacros: Macros[]
) => {
  const MACRO_MARGIN = 0.05; // 5% margin of error allowed
  const meals: IMeal[] = [];
  const amountOfMeals = userPreferences.amountOfMeals ?? 3;

  // Macro distribution base percentages; can adjust based on number of meals
  const baseDistribution: MacrosDistribution = {
    Breakfast: 0.3,
    Lunch: 0.4,
    Dinner: 0.3,
  };

  // Adjust distribution if fewer than 3 meals are chosen
  const adjustDistributionForLessMeals = (
    mealCount: number
  ): MacrosDistribution => {
    if (mealCount === 2) {
      return {
        Lunch: 0.5,
        Dinner: 0.5,
      };
    } else if (mealCount === 1) {
      return {
        Lunch: 1.0, // Single meal should take all the macros
      };
    }
    return baseDistribution; // Default if 3 or more
  };

  const macroDistribution = adjustDistributionForLessMeals(amountOfMeals);

  // Clone the menu macros to track remaining needs
  let remainingMacros = menuMacros.map((macro) => ({ ...macro }));

  // Helper function to calculate target macros for a specific meal based on distribution percentage
  const calculateTargetMacros = (remaining: Macros[], cut: number) => {
    return remaining.map((macro) => ({
      ...macro,
      amount: macro.amount * cut,
    }));
  };

  // Helper function to check if meal macros fit within remaining macros
  const macrosFit = (mealMacros: Macros[], targetMacros: Macros[]) => {
    return mealMacros.every((mealMacro) => {
      const targetMacro = targetMacros.find((m) => m._id.equals(mealMacro._id));
      if (!targetMacro) return false;

      // Calculate acceptable margin based on target amount
      const margin = targetMacro.amount * MACRO_MARGIN;
      const lowerBound = targetMacro.amount - margin;
      const upperBound = targetMacro.amount + margin;

      return mealMacro.amount >= lowerBound && mealMacro.amount <= upperBound;
    });
  };

  // Helper function to subtract meal macros from remaining macros
  const subtractMacros = (mealMacros: Macros[], remaining: Macros[]) => {
    mealMacros.forEach((mealMacro) => {
      const remainingMacro = remaining.find((m) => m._id.equals(mealMacro._id));
      if (remainingMacro) {
        remainingMacro.amount -= mealMacro.amount;
      }
    });
  };

  // Select a meal of a specific type that fits the target macros
  const selectMeal = async (
    mealType: string,
    cut: number,
    remainingMacros: Macros[],
    meals: IMeal[]
  ) => {
    let suitableMeal: IMeal | null = null;
    const targetMacros = calculateTargetMacros(remainingMacros, cut);

    // Keep querying until a suitable meal is found
    while (!suitableMeal) {
      const [randomMeal] = await Meals.aggregate([
        { $match: { mealType } },
        { $sample: { size: 1 } },
      ]);

      if (!randomMeal) break;

      // Check if the meal's macros fit within the target macros
      if (macrosFit(randomMeal.macros, targetMacros)) {
        subtractMacros(randomMeal.macros, remainingMacros);
        suitableMeal = randomMeal;
      }
    }

    // Ensure suitableMeal is not null before pushing
    if (suitableMeal) {
      meals.push(suitableMeal);
    }
  };

  // Function to distribute remaining meals dynamically
  const distributeExtraMeals = async (remainingMealCount: number) => {
    // Cycle through meal types for variety
    const mealTypes = ["Breakfast", "Lunch", "Dinner"];
    let i = 0;

    for (let j = 0; j < remainingMealCount; j++) {
      const mealType = mealTypes[i % mealTypes.length];
      await selectMeal(mealType, 1 / amountOfMeals, remainingMacros, meals); // Pass all arguments
      i++;
    }
  };

  // Select primary meals with specified distribution
  if (macroDistribution.Lunch)
    await selectMeal("Lunch", macroDistribution.Lunch, remainingMacros, meals);
  if (macroDistribution.Dinner)
    await selectMeal(
      "Dinner",
      macroDistribution.Dinner,
      remainingMacros,
      meals
    );
  if (macroDistribution.Breakfast)
    await selectMeal(
      "Breakfast",
      macroDistribution.Breakfast,
      remainingMacros,
      meals
    );

  // Handle remaining meals if more than 3
  if (amountOfMeals > 3) {
    const remainingMealCount =
      amountOfMeals - Object.keys(macroDistribution).length;
    await distributeExtraMeals(remainingMealCount);
  }

  return meals;
};
