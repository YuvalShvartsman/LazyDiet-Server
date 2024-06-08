import { Request, Response } from "express";
import DietTypes from "../models/DietTypes";

export const getDietTypes = async (req: Request, res: Response) => {
  try {
    const dietTypes = DietTypes.find();
    res.json(dietTypes);
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .send(
        "A problem occured while trying to get diet types from the server."
      );
  }
};
