import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMonthlyMenus extends Document {
  userId: Types.ObjectId;
  month: string;
  menus: Types.ObjectId[];
}

const monthlyMenusSchema: Schema<IMonthlyMenus> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  month: { type: String, required: true },
  menus: [{ type: Schema.Types.ObjectId, ref: "menus", required: true }],
});

const MonthlyMenus: Model<IMonthlyMenus> = mongoose.model<IMonthlyMenus>(
  "monthlyMenus",
  monthlyMenusSchema,
  "monthlyMenus"
);

export default MonthlyMenus;
