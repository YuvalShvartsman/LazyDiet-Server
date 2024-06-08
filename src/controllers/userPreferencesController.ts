import { Request, Response } from "express";
import UserPreferences, { IUserPreferences } from "../models/UserPreferences";

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
