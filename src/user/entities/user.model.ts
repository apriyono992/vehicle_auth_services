import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  identityNumber: { type: Number, required: true, unique: true },
});

export interface User extends mongoose.Document {
  id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  identityNumber: number;
}
