import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";
import {
  badRequestResponse,
  isAuthSession,
  parseExpenseBody,
  requireAuth,
} from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (!isAuthSession(authResult)) return authResult;

  await connectDB();

  const limit = Number(request.nextUrl.searchParams.get("limit") || "10");
  const entries = await Expense.find()
    .sort({ date: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ entries });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (!isAuthSession(authResult)) return authResult;

  const body = await request.json();
  const parsed = parseExpenseBody(body);
  if (parsed.error) {
    return badRequestResponse(parsed.error);
  }

  await connectDB();

  const entry = await Expense.create({
    ...parsed.data,
    createdBy: authResult.user.id,
  });

  return NextResponse.json({ entry }, { status: 201 });
}
