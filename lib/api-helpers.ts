import { NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "@/lib/auth";
import type { PavtiStatus } from "@/models/Pavti";

const MAX_LIST_LIMIT = 100;

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function badRequestResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFoundResponse() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export function tooManyRequestsResponse(
  message = "Too many requests. Please try again later.",
) {
  return NextResponse.json({ error: message }, { status: 429 });
}

export function serverErrorResponse(
  message = "Something went wrong. Please try again later.",
) {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function clampLimit(raw: string | null, fallback = 10) {
  const parsed = Number(raw ?? fallback);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(Math.floor(parsed), MAX_LIST_LIMIT);
}

export async function handleApiRoute(
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    console.error("API error:", error);
    return serverErrorResponse();
  }
}

export async function requireAuth(): Promise<Session | NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return unauthorizedResponse();
  }
  return session;
}

export function isAuthSession(
  result: Session | NextResponse,
): result is Session {
  return "user" in result;
}

export function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

function parseAmount(amount: unknown): number | null {
  const parsed = Number(amount);
  if (isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

function parseDate(date: unknown): Date | null {
  if (!date || typeof date !== "string") return null;
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return null;
  return parsed;
}

export interface PavtiInput {
  status: PavtiStatus;
  date: Date;
  recipientName: string;
  address: string;
  phoneNumber: string;
  amount: number;
}

export function parsePavtiBody(
  body: Record<string, unknown>,
  partial = false,
): { data?: PavtiInput; error?: string } {
  const result: Partial<PavtiInput> = {};

  if ("status" in body || !partial) {
    if (!body.status && !partial) {
      return { error: "Missing required fields" };
    }
    if (body.status !== undefined) {
      if (!["completed", "pending"].includes(body.status as string)) {
        return { error: "Invalid status" };
      }
      result.status = body.status as PavtiStatus;
    }
  }

  if ("date" in body || !partial) {
    if (!body.date && !partial) {
      return { error: "Missing required fields" };
    }
    if (body.date !== undefined) {
      const parsedDate = parseDate(body.date);
      if (!parsedDate) return { error: "Invalid date" };
      result.date = parsedDate;
    }
  }

  if ("recipientName" in body || !partial) {
    if (!body.recipientName && !partial) {
      return { error: "Missing required fields" };
    }
    if (body.recipientName !== undefined) {
      const name = String(body.recipientName).trim();
      if (!name) return { error: "Invalid recipient name" };
      result.recipientName = name;
    }
  }

  if ("address" in body || !partial) {
    if (!body.address && !partial) {
      return { error: "Missing required fields" };
    }
    if (body.address !== undefined) {
      const address = String(body.address).trim();
      if (!address) return { error: "Invalid address" };
      result.address = address;
    }
  }

  if ("phoneNumber" in body || !partial) {
    if (!body.phoneNumber && !partial) {
      return { error: "Missing required fields" };
    }
    if (body.phoneNumber !== undefined) {
      const phoneNumber = String(body.phoneNumber).trim();
      if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
        return { error: "Invalid phone number" };
      }
      result.phoneNumber = phoneNumber;
    }
  }

  if ("amount" in body || !partial) {
    if (body.amount === undefined && !partial) {
      return { error: "Missing required fields" };
    }
    if (body.amount !== undefined) {
      const parsedAmount = parseAmount(body.amount);
      if (parsedAmount === null) return { error: "Invalid amount" };
      result.amount = parsedAmount;
    }
  }

  if (!partial) {
    if (
      !result.status ||
      !result.date ||
      !result.recipientName ||
      !result.address ||
      !result.phoneNumber ||
      result.amount === undefined
    ) {
      return { error: "Missing required fields" };
    }
    return { data: result as PavtiInput };
  }

  if (Object.keys(result).length === 0) {
    return { error: "No valid fields to update" };
  }

  return { data: result as PavtiInput };
}

export interface ExpenseInput {
  date: Date;
  description: string;
  amount: number;
  paidBy: string;
}

export function parseExpenseBody(
  body: Record<string, unknown>,
  partial = false,
): { data?: ExpenseInput; error?: string } {
  const result: Partial<ExpenseInput> = {};

  if ("date" in body || !partial) {
    if (!body.date && !partial) {
      return { error: "Missing required fields" };
    }
    if (body.date !== undefined) {
      const parsedDate = parseDate(body.date);
      if (!parsedDate) return { error: "Invalid date" };
      result.date = parsedDate;
    }
  }

  if ("description" in body || !partial) {
    if (!body.description && !partial) {
      return { error: "Missing required fields" };
    }
    if (body.description !== undefined) {
      const description = String(body.description).trim();
      if (!description) return { error: "Invalid description" };
      result.description = description;
    }
  }

  if ("amount" in body || !partial) {
    if (body.amount === undefined && !partial) {
      return { error: "Missing required fields" };
    }
    if (body.amount !== undefined) {
      const parsedAmount = parseAmount(body.amount);
      if (parsedAmount === null) return { error: "Invalid amount" };
      result.amount = parsedAmount;
    }
  }

  if ("paidBy" in body || !partial) {
    if (!body.paidBy && !partial) {
      return { error: "Missing required fields" };
    }
    if (body.paidBy !== undefined) {
      const paidBy = String(body.paidBy).trim();
      if (!paidBy) return { error: "Invalid paid by name" };
      result.paidBy = paidBy;
    }
  }

  if (!partial) {
    if (
      !result.date ||
      !result.description ||
      result.amount === undefined ||
      !result.paidBy
    ) {
      return { error: "Missing required fields" };
    }
    return { data: result as ExpenseInput };
  }

  if (Object.keys(result).length === 0) {
    return { error: "No valid fields to update" };
  }

  return { data: result as ExpenseInput };
}

export function parseDateRange(
  from: string | null,
  to: string | null,
): { start: Date; end: Date } | { error: string } {
  const now = new Date();

  let start: Date;
  if (from) {
    start = new Date(from);
    if (isNaN(start.getTime())) {
      return { error: "Invalid from date" };
    }
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  let end: Date;
  if (to) {
    end = new Date(to);
    if (isNaN(end.getTime())) {
      return { error: "Invalid to date" };
    }
  } else {
    end = now;
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  if (start > end) {
    return { error: "From date must be before to date" };
  }

  return { start, end };
}

export function parsePavtiStatusFilter(
  status: string | null,
): { status: PavtiStatus | null } | { error: string } {
  if (!status) return { status: null };
  if (!["completed", "pending"].includes(status)) {
    return { error: "Invalid status filter" };
  }
  return { status: status as PavtiStatus };
}
