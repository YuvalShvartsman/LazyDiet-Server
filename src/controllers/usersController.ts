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

export const createUser = async (res: Response, req: ICreateUserRequest) => {
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

export const getAllUsers = async (res: Response, req: Request) => {
  try {
    const allUsers = await Users.find();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error finding users:", error);
  }
};

async function verify(token: string): Promise<TokenPayload | undefined> {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

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

      res.cookie("jwt", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // TODO: if production is to someday exist set to true. 
        maxAge: 3600000, // 1 hour
      });
    } else {
      res.status(401).send("Invalid token");
    }
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};
