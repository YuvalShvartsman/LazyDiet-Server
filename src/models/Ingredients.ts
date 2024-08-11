import mongoose, { Schema, Document } from "mongoose";

import { INutrient } from "./Nutrients";

export interface IIngredient extends Document {
  fdc_id: number;
  ingredient_description: string;
  nutrientValues?: INutrient[];
}

const IngredientSchema: Schema = new Schema(
  {
    Ingredient_description: { type: String, required: true },
    fdc_id: { type: Number, required: true, unique: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

IngredientSchema.virtual("nutrientValues", {
  ref: "nutrients",
  localField: "fdc_id",
  foreignField: "fdc_id",
});

export const Ingredient = mongoose.model<IIngredient>(
  "ingredients",
  IngredientSchema
);
