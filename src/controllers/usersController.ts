import { Request,Response } from "express"
import Users from "../models/Users"

interface ICreateUserBody extends Request {
  body:{
    userName:string;
    password:string;
    isAdmin:boolean;
  }
}

export const createUser = async(res:Response,req:ICreateUserBody)=>{
  const {userName,password,isAdmin } =  req.body
try {
  const newUser = await Users.create({
    userName,password,isAdmin
  });
} catch (error) {
  console.error('Error creating user:', error);}
}

export const getAllUsers = async(res:Response,req:Request)=>{
  try {
   const allUsers = await Users.find()
   res.status(200).json(allUsers)
  } catch (error) {
    console.error('Error finding users:', error);}  
  }