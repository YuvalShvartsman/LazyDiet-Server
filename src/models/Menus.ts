import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ObjectId } from "mongodb";

export type Macros = { amount: number; _id: Types.ObjectId };

export interface IMenus extends Document {
  menu: { meals: Types.ObjectId[]; day: number; macros: Macros[] };
}

const menusSchema: Schema<IMenus> = new Schema({
  menu: {
    meals: [{ type: Schema.Types.ObjectId, ref: "meals", required: true }],
    day: { type: Number, required: true },
    macros: [
      {
        amount: { type: Number, required: true },
        name: { type: String, required: true },
        _id: { type: Schema.Types.ObjectId, required: true },
      },
    ],
  },
});

const Menus: Model<IMenus> = mongoose.model<IMenus>("menus", menusSchema);

export default Menus;
