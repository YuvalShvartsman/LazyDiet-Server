import mongoose, { Schema, Document } from "mongoose";

interface INutrientName extends Document {
  // id: number;
  name: string;
  nutrient_id: number;
}

const NutrientNamesSchema: Schema = new Schema({
  // id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  nutrient_id: { type: Number, required: true },
});

export const nutrientsNames = mongoose.model<INutrientName>(
  "nutrientsNames",
  NutrientNamesSchema
);
