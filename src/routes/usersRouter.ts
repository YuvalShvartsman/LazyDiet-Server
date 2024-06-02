import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  googleSignIn,
} from "../controllers/usersController";

const router = express.Router();

router.get("/allUsers", getAllUsers);
router.get("/userById/:id", getUserById);

router.post("/createUser", createUser);
router.post("/google-signIn", googleSignIn);

export { router as usersRouter };
