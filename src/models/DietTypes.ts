import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDietTypes extends Document {
  dietType: string;
}

const dietSchema: Schema<IDietTypes> = new Schema({
  dietType: { type: String, required: true },
});

const DietTypes: Model<IDietTypes> = mongoose.model<IDietTypes>(
  "dietTypes",
  dietSchema
);

export default DietTypes;
