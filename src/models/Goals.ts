import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IGoals extends Document {
  id: Types.ObjectId;
  goal: string;
}

const goalsSchema: Schema<IGoals> = new Schema({
  id: { type: Schema.Types.ObjectId },
  goal: { type: String, required: true },
});

const Goals: Model<IGoals> = mongoose.model<IGoals>("goals", goalsSchema);

export default Goals;
