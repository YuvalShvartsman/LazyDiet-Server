import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface INutrientsNames extends Document {
  _id: Types.ObjectId;
  id: number;
  name: string;
  nutrient_id: number;
}

const nutrientsNamesSchema: Schema<INutrientsNames> = new Schema({
  _id: { type: Schema.Types.ObjectId },
  id: { type: Number, required: true },
  name: { type: String, required: true },
  nutrient_id: { type: Number, required: true },
});

const NutrientsNames: Model<INutrientsNames> = mongoose.model<INutrientsNames>(
  "nutrientsNames",
  nutrientsNamesSchema
);

export default NutrientsNames;
