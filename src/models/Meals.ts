import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMeal extends Document {
  userId: Types.ObjectId;
  mealName: string;
  description: number;
  prep: mongoose.Types.ObjectId;
  ingredients: { ingredient: mongoose.Types.ObjectId; amount: number }[];
  macros: { nutrientName: mongoose.Types.ObjectId; amount: number }[];
}

const MealSchema: Schema = new Schema({
  userId: { type: String, required: true, ref: "users" },
  mealName: { type: String, required: true },
  description: { type: String, required: false },
  prep: { type: String, required: false },
  ingredients: [
    {
      amount: { type: Number, required: true },
      ingredient: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "ingredients",
      },
    },
  ],
  macros: [
    {
      amount: { type: Number, required: true },
      nutrientName: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "nutrientsNames",
      },
    },
  ],
});

export const Meals = mongoose.model<IMeal>("meals", MealSchema);
