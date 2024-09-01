import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMealTypes extends Document {
  _id: Types.ObjectId;
  mealType: string;
}

const mealTypesSchema: Schema<IMealTypes> = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    mealType: { type: String, required: true },
  },
  { collection: "mealTypes" }
);

const MealTypes: Model<IMealTypes> = mongoose.model<IMealTypes>(
  "mealTypes",
  mealTypesSchema
);

export default MealTypes;
