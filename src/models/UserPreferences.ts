import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserPreferences extends Document {
  userId: Types.ObjectId;
  weight: string;
  height: string;
  age: string;
  goal: Types.ObjectId;
  amountOfMeals?: number;
  dietType: Types.ObjectId;
  sensitivities: Types.ObjectId;
  suggestFoods: boolean;
}

const userPreferencesSchema: Schema<IUserPreferences> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    weight: { type: String, required: true },
    height: { type: String, required: true },
    age: { type: String, required: true },
    goal: { type: Schema.Types.ObjectId, ref: "goals", required: true },
    amountOfMeals: { type: Number, required: false },
    dietType: { type: Schema.Types.ObjectId, ref: "dietTypes", required: true },
    sensitivities: {
      type: Schema.Types.ObjectId,
      ref: "sensitivities",
      required: true,
    },
    suggestFoods: { type: Boolean, required: true },
  },
  { collection: "usersPreferences" }
);

const usersPreferences: Model<IUserPreferences> =
  mongoose.model<IUserPreferences>("usersPreferences", userPreferencesSchema);

export default usersPreferences;
