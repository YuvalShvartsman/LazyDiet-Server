import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISensitivities extends Document {
  sensitivity: string;
}

const sensitivitiesSchema: Schema<ISensitivities> = new Schema({
  sensitivity: { type: String, required: true },
});

const Sensitivities: Model<ISensitivities> = mongoose.model<ISensitivities>(
  "sensitivities",
  sensitivitiesSchema
);

export default Sensitivities;
