import useExpenseStore from "../store/useExpenseStore";

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
  const total = useExpenseStore((s) => s.getTotalSpent());
  const biggest = useExpenseStore((s) => s.getBiggestCategory());
  const count = useExpenseStore((s) => s.getFilteredExpenses().length);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <Card
        label="Total Spent"
        value={`$${total.toFixed(2)}`}
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
