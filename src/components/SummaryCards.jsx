import { useMemo } from "react";
import useExpenseStore from "../store/useExpenseStore";
import { formatCurrency } from "../utils/formatCurrency";

const Card = ({ label, value, sub, valueClass }) => (
  <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800/60 flex flex-col gap-1 hover:border-zinc-700 transition-colors">
    <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest">
      {label}
    </p>
    <p className={`text-2xl font-bold ${valueClass || "text-[#d1d1d1]"}`}>
      {value}
    </p>
    {sub && <p className="text-xs text-zinc-700 mt-1">{sub}</p>}
  </div>
);

export default function SummaryCards() {
  const expenses = useExpenseStore((s) => s.expenses);
  const filterCategory = useExpenseStore((s) => s.filterCategory);
  const filterMonth = useExpenseStore((s) => s.filterMonth);
  const currency = useExpenseStore((s) => s.currency);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchCat = filterCategory === "All" || e.category === filterCategory;
      const matchMonth = !filterMonth || e.date.startsWith(filterMonth);
      return matchCat && matchMonth;
    });
  }, [expenses, filterCategory, filterMonth]);

  const total = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses],
  );

  const biggest = useMemo(() => {
    if (!filteredExpenses.length) return "—";
    const totals = {};
    filteredExpenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
  }, [filteredExpenses]);

  const count = filteredExpenses.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <Card
        label="Total Spent"
        value={formatCurrency(total, currency)}
        sub="filtered period"
        valueClass="text-[#d1d1d1]"
      />
      <Card
        label="Transactions"
        value={count}
        sub="filtered results"
        valueClass="text-white"
      />
      <Card
        label="Top Category"
        value={biggest || "—"}
        sub="by amount"
        valueClass="text-zinc-400"
      />
    </div>
  );
}
