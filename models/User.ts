import { Schema, models, model } from "mongoose";

export interface IUser {
  username: string;
  passwordHash: string;
  displayName: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true, maxlength: 64 },
    passwordHash: { type: String, required: true, maxlength: 255 },
    displayName: { type: String, required: true, trim: true, maxlength: 100 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const User = models.User || model<IUser>("User", UserSchema);
