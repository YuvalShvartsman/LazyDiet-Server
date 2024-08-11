import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMeal extends Document {
  userId: Types.ObjectId;
  mealName: string;
  description: number;
  prep: mongoose.Types.ObjectId;
  mealType: mongoose.Types.ObjectId;
  ingredients: { ingredient: mongoose.Types.ObjectId; amount: number }[];
  macros: { amount: number; name: string; _id: mongoose.Types.ObjectId }[];
}

const MealSchema: Schema = new Schema({
  userId: { type: String, required: true, ref: "users" },
  mealName: { type: String, required: true },
  description: { type: String, required: false },
  prep: { type: String, required: false },
  mealType: { type: Schema.Types.ObjectId, required: false, ref: "mealTypes" },
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
      name: { type: String, required: true },
      _id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "nutrientsNames",
      },
    },
  ],
});

export const Meals = mongoose.model<IMeal>("meals", MealSchema);
