import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IIngredients extends Document {
  id: Types.ObjectId;
  "ingredient code": number;
  "Ingredient description": string;
  "Nutrient code": number;
  "Nutrient value": number;
  "FDC ID": number;
  // nutrients: Types.ObjectId[];
}

const ingredientsSchema: Schema<IIngredients> = new Schema({
  id: { type: Schema.Types.ObjectId },
  "ingredient code": { type: Number, required: true },
  "Ingredient description": { type: String, required: true },
  "Nutrient code": { type: Number, required: true },
  "Nutrient value": { type: Number, required: true },
  "FDC ID": { type: Number, required: true, ref: "nutrients" },
  // nutrients: [{ type: Schema.Types.ObjectId, ref: "nutrients" }],
});

const Ingredients: Model<IIngredients> = mongoose.model<IIngredients>(
  "ingredients",
  ingredientsSchema
);

export default Ingredients;
