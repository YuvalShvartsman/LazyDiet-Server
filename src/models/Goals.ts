import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";

export interface IGoals extends Document {
  goal: string; // TODO: Change "goal" to name.
  multipliers: { multiplier: number; macro: ObjectId }[];
}

const goalsSchema: Schema<IGoals> = new Schema({
  goal: { type: String, required: true },
  multipliers: [
    {
      multiplier: { type: Number, required: true },
      macro: {
        type: Schema.Types.ObjectId,
        ref: "nutrientsNames",
        required: true,
      },
    },
  ],
});

const Goals: Model<IGoals> = mongoose.model<IGoals>("goals", goalsSchema);

export default Goals;
