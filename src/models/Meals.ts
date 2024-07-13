import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMeal extends Document {
  userId: Types.ObjectId;
  mealName: string;
  description: number;
  prep: mongoose.Types.ObjectId;
  ingredients: mongoose.Types.ObjectId[];
}

const MealSchema: Schema = new Schema({
  userId: { type: String, required: true, ref: "users" },
  mealName: { type: String, required: true },
  description: { type: String, required: false },
  prep: { type: String, required: false },
  ingredients: [
    { type: Schema.Types.ObjectId, required: false, ref: "ingredients" },
  ],
});

export const Meals = mongoose.model<IMeal>("meals", MealSchema);
