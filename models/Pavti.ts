import { Schema, models, model } from "mongoose";

export type PavtiStatus = "completed" | "pending";

export interface IPavti {
  status: PavtiStatus;
  date: Date;
  recipientName: string;
  address: string;
  amount: number;
  createdBy: string;
  createdAt: Date;
}

const PavtiSchema = new Schema<IPavti>(
  {
    status: {
      type: String,
      enum: ["completed", "pending"],
      default: "completed",
      required: true,
    },
    date: { type: Date, required: true },
    recipientName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    createdBy: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Pavti = models.Pavti || model<IPavti>("Pavti", PavtiSchema);
