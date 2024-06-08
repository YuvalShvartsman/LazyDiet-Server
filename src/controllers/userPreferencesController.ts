import { Request, Response } from "express";

interface ISaveUserRequest extends Request {
  body: {
    userPreferences: string;
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
      console.log(userPreferences, userId);
    } else {
      res.status(401).send("Invalid token");
    }
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};
