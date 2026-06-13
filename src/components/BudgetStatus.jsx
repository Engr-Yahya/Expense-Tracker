import { useMemo } from "react";
import useExpenseStore, { CATEGORIES } from "../store/useExpenseStore";
import { formatCurrency, getCurrencySymbol } from "../utils/formatCurrency";

export default function BudgetStatus() {
  const expenses = useExpenseStore((s) => s.expenses);
  const budgets = useExpenseStore((s) => s.budgets);
  const filterMonth = useExpenseStore((s) => s.filterMonth);
  const currency = useExpenseStore((s) => s.currency);

  const currentMonth = useMemo(() => {
    if (filterMonth) return filterMonth;
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  }, [filterMonth]);

  const budgetStatus = useMemo(() => {
    return CATEGORIES.map((category) => {
      const budget = budgets[category] || 0;
      if (budget === 0) return null;

      const spent = expenses
        .filter((e) => e.category === category && e.date.startsWith(currentMonth))
        .reduce((sum, e) => sum + e.amount, 0);

      const percentage = budget > 0 ? (spent / budget) * 100 : 0;
      const isOverBudget = spent > budget;

      return {
        category,
        budget,
        spent,
        percentage: Math.min(percentage, 100),
        isOverBudget,
        remaining: Math.max(budget - spent, 0),
      };
    }).filter(Boolean);
  }, [expenses, budgets, currentMonth]);

  if (budgetStatus.length === 0) {
    return null;
  }

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800/60 p-6">
      <h2 className="text-base font-semibold text-[#d1d1d1] mb-5 tracking-tight">
        Monthly Budget Status
      </h2>

      <div className="space-y-4">
        {budgetStatus.map((status) => {
          const progressColor = status.isOverBudget
            ? "bg-red-600"
            : status.percentage > 75
              ? "bg-yellow-600"
              : "bg-emerald-600";

          const textColor = status.isOverBudget
            ? "text-red-400"
            : status.percentage > 75
              ? "text-yellow-400"
              : "text-emerald-400";

          return (
            <div key={status.category} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">
                  {status.category}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500">
                    {formatCurrency(status.spent, currency)} of {formatCurrency(status.budget, currency)}
                  </span>
                  <span className={`font-semibold ${textColor}`}>
                    {status.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${progressColor}`}
                  style={{ width: `${status.percentage}%` }}
                />
              </div>

              {status.isOverBudget && (
                <p className="text-xs text-red-400">
                  Over budget by {formatCurrency(status.spent - status.budget, currency)}
                </p>
              )}
              {!status.isOverBudget && status.remaining > 0 && (
                <p className="text-xs text-zinc-600">
                  {formatCurrency(status.remaining, currency)} remaining
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
