import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { INutrientsNames } from "./NutrientsNames";

export interface INutrients extends Document {
  _id: Types.ObjectId;
  id: number;
  fdc_id: number;
  nutrient_id: number;
  amount: number;
  derivation_id: number;
  nutrient_name: Types.ObjectId | INutrientsNames;
}

const nutrientsSchema: Schema<INutrients> = new Schema({
  _id: { type: Schema.Types.ObjectId },
  id: { type: Number, required: true },
  fdc_id: { type: Number, required: true },
  nutrient_id: { type: Number, required: true },
  amount: { type: Number, required: true },
  derivation_id: { type: Number, required: true },
  nutrient_name: { type: Schema.Types.ObjectId, ref: "nutrientsNames" },
});

const Nutrients: Model<INutrients> = mongoose.model<INutrients>(
  "nutrients",
  nutrientsSchema
);

export default Nutrients;
