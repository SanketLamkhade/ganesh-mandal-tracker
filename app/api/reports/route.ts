import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Pavti } from "@/models/Pavti";
import { Expense } from "@/models/Expense";
import {
  badRequestResponse,
  handleApiRoute,
  isAuthSession,
  parseDateRange,
  parsePavtiStatusFilter,
  requireAuth,
} from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  return handleApiRoute(async () => {
    const authResult = await requireAuth();
    if (!isAuthSession(authResult)) return authResult;

    const { searchParams } = request.nextUrl;
    const dateRange = parseDateRange(
      searchParams.get("from"),
      searchParams.get("to"),
    );
    if ("error" in dateRange) {
      return badRequestResponse(dateRange.error);
    }

    const statusResult = parsePavtiStatusFilter(searchParams.get("status"));
    if ("error" in statusResult) {
      return badRequestResponse(statusResult.error);
    }

    await connectDB();

    const { start, end } = dateRange;
    const dateFilter = { $gte: start, $lte: end };
    const pavtiQuery: Record<string, unknown> = { date: dateFilter };
    if (statusResult.status) {
      pavtiQuery.status = statusResult.status;
    }

    const [pavtis, expenses] = await Promise.all([
      Pavti.find(pavtiQuery).sort({ date: -1 }).lean(),
      Expense.find({ date: dateFilter }).sort({ date: -1 }).lean(),
    ]);

    const totalPavti = pavtis.reduce((sum, p) => sum + p.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const completedPavtis = pavtis.filter((p) => p.status === "completed");
    const pendingPavtis = pavtis.filter((p) => p.status === "pending");

    return NextResponse.json({
      summary: {
        totalPavti,
        totalExpense,
        netBalance: totalPavti - totalExpense,
        completedCount: completedPavtis.length,
        completedAmount: completedPavtis.reduce((s, p) => s + p.amount, 0),
        pendingCount: pendingPavtis.length,
        pendingAmount: pendingPavtis.reduce((s, p) => s + p.amount, 0),
      },
      pavtis,
      expenses,
    });
  });
}
