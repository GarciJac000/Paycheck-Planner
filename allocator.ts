import { Decimal } from "@prisma/client/runtime/library";

export interface AllocationRequest {
  netPay: Decimal | number;
  bills: Array<{
    id: string;
    name: string;
    amount: Decimal | number;
    dueDate: number;
    isFixed: boolean;
  }>;
}

export interface AllocationResult {
  allocations: Array<{
    billId: string | null;
    category: "fixed_bill" | "flexible_spending" | "savings";
    allocatedAmount: number;
    orderPriority: number;
  }>;
  remaining: number;
  summary: string;
}

export function allocatePaycheck(request: AllocationRequest): AllocationResult {
  const netPay = Number(request.netPay);
  let remaining = netPay;
  const allocations: AllocationResult["allocations"] = [];
  let priority = 1;

  // Sort bills by due date
  const sortedBills = [...request.bills].sort(
    (a, b) => a.dueDate - b.dueDate
  );

  // Allocate fixed bills first
  for (const bill of sortedBills) {
    if (bill.isFixed && remaining > 0) {
      const amount = Math.min(Number(bill.amount), remaining);
      allocations.push({
        billId: bill.id,
        category: "fixed_bill",
        allocatedAmount: amount,
        orderPriority: priority++,
      });
      remaining -= amount;
    }
  }

  // Allocate flexible bills
  for (const bill of sortedBills) {
    if (!bill.isFixed && remaining > 0) {
      const amount = Math.min(Number(bill.amount), remaining);
      allocations.push({
        billId: bill.id,
        category: "flexible_spending",
        allocatedAmount: amount,
        orderPriority: priority++,
      });
      remaining -= amount;
    }
  }

  // Remaining goes to savings
  if (remaining > 0) {
    allocations.push({
      billId: null,
      category: "savings",
      allocatedAmount: Math.round(remaining * 100) / 100,
      orderPriority: priority,
    });
  }

  return {
    allocations,
    remaining: Math.max(0, remaining),
    summary: `Allocated $${netPay} across ${allocations.length} categories`,
  };
}

export function calculateSuggestions(
  netPay: number,
  allocations: any[]
): string[] {
  const suggestions: string[] = [];

  const fixedTotal = allocations
    .filter((a) => a.category === "fixed_bill")
    .reduce((sum, a) => sum + Number(a.allocatedAmount), 0);

  const fixedPercent = (fixedTotal / netPay) * 100;

  if (fixedPercent > 60) {
    suggestions.push(
      "⚠️ Fixed bills are >60% of income. Consider reducing obligations."
    );
  }

  const savingsTotal = allocations
    .filter((a) => a.category === "savings")
    .reduce((sum, a) => sum + Number(a.allocatedAmount), 0);

  if (savingsTotal > 0) {
    suggestions.push(
      `✅ Great job! You're saving $${savingsTotal.toFixed(2)} this paycheck.`
    );
  }

  if (fixedPercent < 50) {
    suggestions.push(
      `💡 You have flexibility. Consider building an emergency fund.`
    );
  }

  return suggestions;
}
