import { Request, Response } from "express";
import UserPreferences, { IUserPreferences } from "../models/UserPreferences";
import Goals from "../models/Goals";
import Sensitivities from "../models/Sensitivities";
import DietTypes from "../models/DietTypes";

interface ISaveUserRequest extends Request {
  body: {
    userPreferences: IUserPreferences;
    userId: string;
  };
}

export const saveUserPreferences = async (
  req: ISaveUserRequest,
  res: Response
) => {
  const { userPreferences, userId } = req.body;
  let createdPreferences = {};
  try {
    if (userPreferences && userId) {
      const userPreferencesExists = await UserPreferences.find({ userId });
      if (!userPreferencesExists)
        createdPreferences = await UserPreferences.create({
          userPreferences,
          userId,
        });
      else
        createdPreferences = await UserPreferences.updateOne({
          userPreferences,
          userId,
        });

      res.json({ data: { createdPreferences } });
    } else {
      res.status(401).send("A problem occured while saving form data.");
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("A problem occured while saving form data.");
  }
};

export const getUserPreferencesOptions = async (
  req: Request,
  res: Response
) => {
  try {
    const goals = await Goals.find();
    const sensitivities = await Sensitivities.find();
    const dietTypes = await DietTypes.find();

    console.log(goals, sensitivities, dietTypes);

    res.json({ data: { goals, sensitivities, dietTypes } });
  } catch (error) {
    console.log(error);
    res.status(401).send("A problem occured while saving form data.");
  }
};
