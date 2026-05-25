import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";
import {
  badRequestResponse,
  isAuthSession,
  isValidObjectId,
  notFoundResponse,
  parseExpenseBody,
  requireAuth,
} from "@/lib/api-helpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth();
  if (!isAuthSession(authResult)) return authResult;

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return badRequestResponse("Invalid id");
  }

  await connectDB();

  const entry = await Expense.findById(id).lean();
  if (!entry) {
    return notFoundResponse();
  }

  return NextResponse.json({ entry });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth();
  if (!isAuthSession(authResult)) return authResult;

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return badRequestResponse("Invalid id");
  }

  const body = await request.json();
  const parsed = parseExpenseBody(body, true);
  if (parsed.error) {
    return badRequestResponse(parsed.error);
  }

  await connectDB();

  const entry = await Expense.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!entry) {
    return notFoundResponse();
  }

  return NextResponse.json({ entry });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const authResult = await requireAuth();
  if (!isAuthSession(authResult)) return authResult;

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return badRequestResponse("Invalid id");
  }

  await connectDB();

  const entry = await Expense.findByIdAndDelete(id).lean();
  if (!entry) {
    return notFoundResponse();
  }

  return NextResponse.json({ success: true });
}
