import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserPreferences extends Document {
  userId: Types.ObjectId;
  weight: string; //  TODO: MAKE THIS A NUMBER!  WHY IS THIS A STRING????????????????
  height: string; //  TODO: MAKE THIS A NUMBER!  WHY IS THIS A STRING????????????????
  age: string;
  goal: Types.ObjectId;
  amountOfMeals?: number;
  dietType?: Types.ObjectId;
  sensitivities?: Types.ObjectId;
  suggestFoods?: boolean;
}

const userPreferencesSchema: Schema<IUserPreferences> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    weight: { type: String, required: true },
    height: { type: String, required: true },
    age: { type: String, required: true },
    goal: { type: Schema.Types.ObjectId, ref: "goals", required: true },
    amountOfMeals: { type: Number, required: false },
    dietType: {
      type: Schema.Types.ObjectId,
      ref: "dietTypes",
      required: false,
    },
    sensitivities: {
      type: Schema.Types.ObjectId,
      ref: "sensitivities",
      required: false,
    },
    suggestFoods: { type: Boolean, required: false },
  },
  { collection: "usersPreferences" }
);

const usersPreferences: Model<IUserPreferences> =
  mongoose.model<IUserPreferences>("usersPreferences", userPreferencesSchema);

export default usersPreferences;
