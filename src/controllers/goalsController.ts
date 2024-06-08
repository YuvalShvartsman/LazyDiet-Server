import { Request, Response } from "express";
import Goals from "../models/Goals";

export const getGoals = async (req: Request, res: Response) => {
  try {
    const goals = Goals.find();
    res.json(goals);
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .send("A problem occured while trying to get goals from the server.");
  }
};
