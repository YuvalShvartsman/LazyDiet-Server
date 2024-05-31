import { Request, Response } from "express";

import Users, { IUser } from "../models/Users";

import { OAuth2Client, TokenPayload } from "google-auth-library";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const client = new OAuth2Client(CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET!;

interface ICreateUserRequest extends Request {
  body: {
    userName: string;
    password: string;
    isAdmin: boolean;
  };
}

interface GoogleSignInRequest extends Request {
  body: {
    token: string;
  };
}

// helper functions
async function verify(token: string): Promise<TokenPayload | undefined> {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

// get functions
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await Users.find();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error finding users:", error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const _id = req.params.id;
  try {
    const user = await Users.findOne({ _id });
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error finding users:", error);
  }
};

// post functions
export const createUser = async (req: ICreateUserRequest, res: Response) => {
  const { userName, password, isAdmin } = req.body;
  try {
    const newUser = await Users.create({
      userName,
      password,
      isAdmin,
    });
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

export const googleSignIn = async (req: GoogleSignInRequest, res: Response) => {
  const { token } = req.body;
  try {
    const userPayload = await verify(token);
    if (userPayload) {
      const { sub: googleId, email, name, picture } = userPayload;
      let user = (await Users.findOne({ googleId }).exec()) as IUser | null;

      if (!user) {
        await Users.create({ googleId, email, name, picture });
      }

      const jwtToken = jwt.sign({ userId: user?._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ user, token: jwtToken });
    } else {
      res.status(401).send("Invalid token");
    }
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};
