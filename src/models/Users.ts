import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  googleId: string;
  email: string;
  name: string;
  picture: string;
  isAdmin?: boolean;
}

const userSchema: Schema<IUser> = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  googleId: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String, required: true },
  isAdmin: { type: Boolean, required: false },
});

const Users: Model<IUser> = mongoose.model<IUser>("users", userSchema);

export default Users;
