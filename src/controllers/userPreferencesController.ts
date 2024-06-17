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
  console.log(req.body);
  const { userPreferences, userId } = req.body;
  try {
    if (userPreferences && userId) {
      console.log(userPreferences, userId);
      await UserPreferences.create({ ...userPreferences, userId });
      res.json({ userPreferences });
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
