import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IDietTypes extends Document {
  id: Types.ObjectId;
  dietType: string;
}

const dietSchema: Schema<IDietTypes> = new Schema(
  {
    id: { type: Schema.Types.ObjectId },
    dietType: { type: String, required: true },
  },
  { collection: "dietTypes" }
);

const DietTypes: Model<IDietTypes> = mongoose.model<IDietTypes>(
  "dietTypes",
  dietSchema
);

export default DietTypes;
