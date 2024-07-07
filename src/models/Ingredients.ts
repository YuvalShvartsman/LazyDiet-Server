import mongoose, { Schema, Document } from "mongoose";

interface IIngredient extends Document {
  fdc_id: number;
  ingredient_description: string;
  nutrients: mongoose.Types.ObjectId[];
}

const IngredientSchema: Schema = new Schema({
  Ingredient_description: { type: String, required: true },
  fdc_id: { type: Number, required: true, unique: true },
  nutrients: [{ type: mongoose.Types.ObjectId, ref: "nutrients" }],
});

export const Ingredient = mongoose.model<IIngredient>(
  "ingredients",
  IngredientSchema
);
