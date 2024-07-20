import mongoose, { Schema, Document } from "mongoose";

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

export const Nutrients = mongoose.model<INutrient>("nutrients", NutrientSchema);
