import { Request, Response } from "express";
import { IUserPreferences } from "../models/UserPreferences";
import { IMeal, Meals } from "../models/Meals";
import MonthlyMenus from "../models/MonthlyMenus";
import Menus, { Macros } from "../models/Menus";
import Goals from "../models/Goals";
import { Types } from "mongoose";
import { IMealTypes } from "../models/MealTypes";

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
        const meals = await createMenu(userPreferences, day);
        if (!meals) return res.status(404).send("No suitable meals found.");

        const menu = new Menus({
          menu: {
            meals: meals.map((meal) => meal._id),
            day: day,
            macros: meals.flatMap((meal) => meal.macros),
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
  const menuMacros = await findMenuMacros(userPreferences);
  if (!menuMacros) return false;

  return findMealsForMenu(userPreferences, menuMacros);
};

const findMenuMacros = async (userPreferences: IUserPreferences) => {
  try {
    const goal = await Goals.findOne({ _id: userPreferences.goal });
    if (!goal) return false;

    const menuMacros: Macros[] = goal.multipliers.map((macro) => ({
      amount: macro.multiplier * Number(userPreferences.weight),
      _id: macro.macro as unknown as Types.ObjectId,
    }));

    return menuMacros;
  } catch (error) {
    console.log("Error finding macros for this menu, Error: ", error);
  }
};

const findMealsForMenu = async (
  userPreferences: IUserPreferences,
  menuMacros: Macros[]
) => {
  const meals: IMeal[] = [];
  const amountOfMeals = userPreferences.amountOfMeals ?? 3;

  const macroDistribution =
    amountOfMeals < 3
      ? getDistributionForLessThanThreeMeals(amountOfMeals)
      : getDynamicDistribution(amountOfMeals);

  let remainingMacros = menuMacros.map((macro) => ({ ...macro }));

  const selectMeal = async (
    mealType: string,
    cut: number,
    remainingMacros: Macros[],
    meals: IMeal[]
  ) => {
    let suitableMeal: IMeal | null = null;
    const targetMacros = calculateTargetMacros(remainingMacros, cut);

    while (!suitableMeal) {
      const [randomMeal] = await Meals.aggregate([
        { $match: { mealType } },
        { $sample: { size: 1 } },
      ]);

      if (!randomMeal) break;

      if (macrosFit(randomMeal.macros, targetMacros)) {
        subtractMacros(randomMeal.macros, remainingMacros);
        suitableMeal = randomMeal;
      }
    }

    if (suitableMeal) {
      meals.push(suitableMeal);
    }
  };

  if (!macroDistribution) {
    throw new Error("Could not create a menu without distribution.");
  }
  for (const [mealType, percentage] of Object.entries(macroDistribution)) {
    await selectMeal(mealType, Number(percentage), remainingMacros, meals);
  }

  const orderMealsLogically = (meals: IMeal[]): IMeal[] => {
    // TypeScript assertion to ensure mealType is treated correctly as populated
    const isPopulated = (
      meal: IMeal
    ): meal is IMeal & { mealType: IMealTypes } =>
      typeof meal.mealType !== "string"; // Check if `mealType` is not a string, meaning it's populated

    const breakfasts = meals.filter(
      (meal) => isPopulated(meal) && meal.mealType.mealType === "Breakfast"
    );
    const lunches = meals.filter(
      (meal) => isPopulated(meal) && meal.mealType.mealType === "Lunch"
    );
    const dinners = meals.filter(
      (meal) => isPopulated(meal) && meal.mealType.mealType === "Dinner"
    );
    const snacks = meals.filter(
      (meal) => isPopulated(meal) && meal.mealType.mealType === "Snack"
    );

    // Ordered meals array
    const orderedMeals: IMeal[] = [];

    // Add breakfasts first
    orderedMeals.push(...breakfasts);

    // Add a snack before lunch if available
    if (snacks.length > 0) {
      orderedMeals.push(snacks.shift()!); // Shift removes the first snack
    }

    // Add lunches
    orderedMeals.push(...lunches);

    // Add a snack between lunch and dinner if available
    if (snacks.length > 0) {
      orderedMeals.push(snacks.shift()!);
    }

    // Add dinners
    orderedMeals.push(...dinners);

    // Add any remaining snacks
    orderedMeals.push(...snacks);

    return orderedMeals;
  };

  const orderedMeals = orderMealsLogically(meals);

  return orderedMeals;
};

const getDynamicDistribution = (amountOfMeals: number) => {
  const baseMeals = ["Breakfast", "Lunch", "Dinner"];
  const extraMealTypes = ["Snack", "Breakfast", "Lunch", "Dinner"];
  const baseMealPercentage = { Breakfast: 0.3, Lunch: 0.4, Dinner: 0.3 };
  const extraMealPercentage = 0.1; // 10% for each extra meal

  const extraMealsCount = amountOfMeals - baseMeals.length;
  const remainingPercentage = 1 - extraMealPercentage * extraMealsCount;

  // Adjust base meals according to the remaining percentage
  let adjustedBaseDistribution = {
    Breakfast: baseMealPercentage.Breakfast * remainingPercentage,
    Lunch: baseMealPercentage.Lunch * remainingPercentage,
    Dinner: baseMealPercentage.Dinner * remainingPercentage,
  };

  // Distribute extra meals between random types.
  const extraMeals: Record<string, number> = {};
  for (let i = 0; i < extraMealsCount; i++) {
    const mealType = extraMealTypes[i % extraMealTypes.length]; // Get random type.
    extraMeals[mealType] = (extraMeals[mealType] || 0) + extraMealPercentage;
  }

  // Combine the adjusted base meals with the extra meals
  const fullDistribution = { ...adjustedBaseDistribution, ...extraMeals };

  return fullDistribution;
};

const getDistributionForLessThanThreeMeals = (amountOfMeals: number) => {
  return {
    1: { Lunch: 1.0 },
    2: { Lunch: 0.6, Dinner: 0.4 },
  }[amountOfMeals];
};

const calculateTargetMacros = (remaining: Macros[], cut: number) => {
  return remaining.map((macro) => ({
    ...macro,
    amount: macro.amount * cut,
  }));
};

const macrosFit = (mealMacros: Macros[], targetMacros: Macros[]) => {
  const MACRO_MARGIN = 0.05; // 5% margin of error allowed

  return mealMacros.every((mealMacro) => {
    const targetMacro = targetMacros.find((m) => m._id.equals(mealMacro._id));
    if (!targetMacro) return false;

    const margin = targetMacro.amount * MACRO_MARGIN;
    const lowerBound = targetMacro.amount - margin;
    const upperBound = targetMacro.amount + margin;

    return mealMacro.amount >= lowerBound && mealMacro.amount <= upperBound;
  });
};

const subtractMacros = (mealMacros: Macros[], remaining: Macros[]) => {
  mealMacros.forEach((mealMacro) => {
    const remainingMacro = remaining.find((m) => m._id.equals(mealMacro._id));
    if (remainingMacro) {
      remainingMacro.amount -= mealMacro.amount;
    }
  });
};
