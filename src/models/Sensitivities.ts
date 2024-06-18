import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISensitivities extends Document {
  id: Types.ObjectId;
  sensitivity: string;
}

const sensitivitiesSchema: Schema<ISensitivities> = new Schema({
  id: { type: Schema.Types.ObjectId },
  sensitivity: { type: String, required: true },
});

const Sensitivities: Model<ISensitivities> = mongoose.model<ISensitivities>(
  "sensitivities",
  sensitivitiesSchema
);

export default Sensitivities;
