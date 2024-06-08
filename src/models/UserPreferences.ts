import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserPreferences extends Document {
  userId: Types.ObjectId;
  weight: string;
  height: string;
  age: string;
  goal: string;
  amountOfMeals?: number;
  dietType: string;
  sensitivities: string;
  suggestFoods: boolean;
}

const userPreferencesSchema: Schema<IUserPreferences> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  weight: { type: String, required: true },
  height: { type: String, required: true },
  age: { type: String, required: true },
  goal: { type: String, required: true },
  amountOfMeals: { type: Number, required: false },
  dietType: { type: String, required: true },
  sensitivities: { type: String, required: true },
  suggestFoods: { type: Boolean, required: true },
});

const usersPreferences: Model<IUserPreferences> =
  mongoose.model<IUserPreferences>("usersPreferences", userPreferencesSchema);

export default usersPreferences;
