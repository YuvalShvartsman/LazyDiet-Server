import mongoose, { Schema, Document } from "mongoose";

interface IIngredient extends Document {
  fdc_id: number;
  // ingredient_code: number;
  ingredient_description: string;
  // nutrient_code: number;
  // nutrient_value: number;
  // nutrient_value_source: string;
  // SR_AddMod_year: number;
  // Foundation_year_acquired: number;
  // start_date: Date;
  // end_date: Date;
  nutrients: mongoose.Types.ObjectId[];
}

const IngredientSchema: Schema = new Schema({
  // "ingredient code": { type: Number, required: true },

  Ingredient_description: { type: String, required: true },
  // "Nutrient code": { type: Number, required: true },
  // "Nutrient value": { type: Number, required: true },
  // "Nutrient value source": { type: String, required: true },
  fdc_id: { type: Number, required: true, unique: true, ref: "nutrients" },
  // "SR AddMod year": { type: Number, required: true },
  // "Foundation year acquired": { type: Number, required: true },
  // "Start date": { type: Date, required: true },
  // "End date": { type: Date, required: true },
  nutrients: [{ type: mongoose.Types.ObjectId }],
});

export const Ingredient = mongoose.model<IIngredient>(
  "ingredients",
  IngredientSchema
);
