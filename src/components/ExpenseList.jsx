import useExpenseStore from "../store/useExpenseStore";
import ExpenseItem from "./ExpenseItem";

export default function ExpenseList() {
  const getFilteredExpenses = useExpenseStore((s) => s.getFilteredExpenses);
  const expenses = getFilteredExpenses();

  return (
    <section aria-labelledby="transactions-heading">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white tracking-tight">
            Transactions
          </h2>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-full">
            {expenses.length}
          </span>
        </div>
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <p className="text-zinc-600 text-sm">No transactions yet</p>
            <p className="text-zinc-700 text-xs">
              Add an expense to get started
            </p>
          </div>
        ) : (
          <div className="px-2 py-2 divide-y divide-zinc-800/60">
            {expenses.map((e) => (
              <ExpenseItem key={e.id} expense={e} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
