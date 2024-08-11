import mongoose, { Schema, Document } from "mongoose";

export interface INutrientName extends Document {
  name: string;
  nutrient_id: number;
}

const NutrientNamesSchema: Schema = new Schema({
  name: { type: String, required: true },
  nutrient_id: { type: Number, required: true },
});

export const NutrientsNames = mongoose.model<INutrientName>(
  "nutrientsNames",
  NutrientNamesSchema,
  "nutrientsNames"
);
