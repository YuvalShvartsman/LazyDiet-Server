import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  userName: string;
  password: string;
  isAdmin?: boolean;
}

const userSchema: Schema<IUser> = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: false },
});

const Users: Model<IUser> = mongoose.model<IUser>('Users', userSchema);

export default Users;
