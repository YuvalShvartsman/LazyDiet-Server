import mongoose, { Schema, Document } from "mongoose";

interface INutrientName extends Document {
  name: string;
  nutrient_id: number;
}

const NutrientNamesSchema: Schema = new Schema({
  name: { type: String, required: true },
  nutrient_id: { type: Number, required: true },
});

export const nutrientsNames = mongoose.model<INutrientName>(
  "nutrientsNames",
  NutrientNamesSchema,
  "nutrientsNames"
);

interface INutrient extends Document {
  fdc_id: number;
  nutrient_id: number;
  amount: number;
}

const NutrientSchema: Schema = new Schema(
  {
    fdc_id: { type: Number, required: true },
    nutrient_id: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

NutrientSchema.virtual("nutrientName", {
  ref: "nutrientsNames",
  localField: "nutrient_id",
  foreignField: "nutrient_id",
  justOne: true,
});

export const nutrients = mongoose.model<INutrient>("nutrients", NutrientSchema);
