import useExpenseStore from "../store/useExpenseStore";

const CATEGORY_STYLES = {
  Food:          "bg-orange-950 text-orange-400 border-orange-900",
  Transport:     "bg-blue-950 text-blue-400 border-blue-900",
  Entertainment: "bg-violet-950 text-violet-400 border-violet-900",
  Shopping:      "bg-pink-950 text-pink-400 border-pink-900",
  Health:        "bg-emerald-950 text-emerald-400 border-emerald-900",
  Bills:         "bg-yellow-950 text-yellow-400 border-yellow-900",
  Other:         "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export default function ExpenseItem({ expense }) {
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 rounded-xl transition group">
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.Other}`}>
          {expense.category}
        </span>
        <div>
          <p className="text-sm font-medium text-zinc-200">{expense.title}</p>
          <p className="text-xs text-zinc-600">{expense.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-white">${expense.amount.toFixed(2)}</p>
        <button
          onClick={() => deleteExpense(expense.id)}
          className="text-zinc-700 hover:text-red-400 text-zinc-500 hover:text-red-400 transition text-xl leading-none"
          aria-label="Delete expense"
        >
          ×
        </button>
      </div>
    </div>
  );
}