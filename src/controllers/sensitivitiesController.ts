import { Request, Response } from "express";
import Sensitivities from "../models/Sensitivities";

export const getSenitivities = async (req: Request, res: Response) => {
  try {
    const sensitivities = Sensitivities.find();
    res.json(sensitivities);
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .send(
        "A problem occured while trying to get sensitivities from the server."
      );
  }
};
