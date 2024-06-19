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
  try {
    if (userPreferences && userId) {
      const userPreferencesExists = await UserPreferences.find({ userId });

      if (!userPreferencesExists) {
        const createdDocument = await UserPreferences.create({
          userPreferences,
          userId,
        });
        res.json({ data: createdDocument });
      } else {
        const updatedDocument = await UserPreferences.findOneAndUpdate({
          userId,
          userPreferences,
        });
        res.json({ data: updatedDocument });
      }
    } else {
      res.status(401).send("A problem occured while saving form data.");
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("A problem occured while saving form data.");
  }
};

export const getPreferencesByUser = async (
  req: ISaveUserRequest,
  res: Response
) => {
  const { userId } = req.params;
  try {
    if (userId) {
      const userPreferences = await UserPreferences.findOne({ userId });
      res.json({ data: userPreferences });
    } else {
      res
        .status(401)
        .send("A problem occurred while trying to retrieve your data");
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("A problem occurred while saving form data.");
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

    res.json({ data: { goals, sensitivities, dietTypes } });
  } catch (error) {
    console.log(error);
    res.status(401).send("A problem occured while saving form data.");
  }
};
