import { Schema, models, model } from "mongoose";

export interface IExpense {
  date: Date;
  description: string;
  amount: number;
  paidBy: string;
  createdBy: string;
  createdAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    date: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paidBy: { type: String, required: true, trim: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Expense =
  models.Expense || model<IExpense>("Expense", ExpenseSchema);
