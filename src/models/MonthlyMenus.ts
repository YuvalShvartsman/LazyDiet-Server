import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMonthlyMenus extends Document {
  userId: Types.ObjectId;
  month: number;
  year: number;
  menus: Types.ObjectId[];
}

const monthlyMenusSchema: Schema<IMonthlyMenus> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  menus: [{ type: Schema.Types.ObjectId, ref: "menus", required: true }],
});

const MonthlyMenus: Model<IMonthlyMenus> = mongoose.model<IMonthlyMenus>(
  "monthlyMenus",
  monthlyMenusSchema,
  "monthlyMenus"
);

export default MonthlyMenus;
