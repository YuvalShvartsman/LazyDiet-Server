import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGoals extends Document {
  goal: string;
}

const goalsSchema: Schema<IGoals> = new Schema({
  goal: { type: String, required: true },
});

const Goals: Model<IGoals> = mongoose.model<IGoals>("goals", goalsSchema);

export default Goals;
