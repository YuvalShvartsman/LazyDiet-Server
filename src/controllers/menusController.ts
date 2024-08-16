import { Request, Response } from "express";

import MonthlyMenus from "../models/MonthlyMenus";

import { Meals } from "../models/Meals";
import Menus from "../models/Menus";

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
    const userPreferences = req.body;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

    const menus = [];

    for (let day = currentDate.getDate(); day <= lastDay; day++) {
      // For now random meals.
      const randomMeal = await Meals.aggregate([{ $sample: { size: 1 } }]);

      if (randomMeal.length === 0) {
        return res.status(404).send("No meals found.");
      }

      const menu = new Menus({
        menu: {
          meals: [randomMeal[0]._id],
          day: `${currentYear}-${currentMonth + 1}-${day}`,
          macros: randomMeal[0].macros,
        },
      });

      await menu.save();
      menus.push(menu._id);
    }

    const monthlyMenu = await MonthlyMenus.create({
      userId: userPreferences.userId,
      month: `${currentYear}-${currentMonth + 1}`,
      menus,
    });
    console.log("🚀 ~ createMonthlyMenus ~ monthlyMenu:", monthlyMenu);

    await monthlyMenu.save();

    res.json({ data: monthlyMenu });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error: Could not create a menu for you.");
  }
};
