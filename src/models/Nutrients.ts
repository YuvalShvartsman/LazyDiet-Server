import mongoose, { Schema, Document } from "mongoose";

interface INutrient extends Document {
  // id: number;
  fdc_id: number;
  nutrient_id: number;
  amount: number;
  // derivation_id: number;
  nutrientsNames: mongoose.Types.ObjectId[];
}

const NutrientSchema: Schema = new Schema({
  // id: { type: Number, required: true, unique: true },
  fdc_id: { type: Number, required: true },
  nutrient_id: { type: Number, required: true, ref: "nutrientsNames" },
  amount: { type: Number, required: true },
  // derivation_id: { type: Number, required: true },
  nutrientsNames: [{ type: mongoose.Types.ObjectId }],
});

export const nutrients = mongoose.model<INutrient>("nutrients", NutrientSchema);
