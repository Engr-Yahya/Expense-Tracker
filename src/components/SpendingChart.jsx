import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useExpenseStore from "../store/useExpenseStore";
import { CATEGORY_COLORS } from "../constants/categoryColors";
import { formatCurrency } from "../utils/formatCurrency";

export default function SpendingChart() {
  const expenses = useExpenseStore((s) => s.expenses);
  const filterCategory = useExpenseStore((s) => s.filterCategory);
  const filterMonth = useExpenseStore((s) => s.filterMonth);
  const currency = useExpenseStore((s) => s.currency);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const item = payload[0];
    const color =
      CATEGORY_COLORS[item.name] || CATEGORY_COLORS.Other;

    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm shadow-2xl">
        <p className="text-zinc-200 font-medium">
          {item.name}
        </p>

        <p
          className="font-semibold mt-1"
          style={{ color }}
        >
          {formatCurrency(item.value, currency)}
        </p>
      </div>
    );
  };

  const data = useMemo(() => {
    const filtered = expenses.filter((e) => {
      const matchCat = filterCategory === "All" || e.category === filterCategory;
      const matchMonth = !filterMonth || e.date.startsWith(filterMonth);
      return matchCat && matchMonth;
    });

    const totals = {};
    filtered.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value: +value.toFixed(2),
    }));
  }, [expenses, filterCategory, filterMonth]);

  if (!data.length) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex items-center justify-center h-52">
        <p className="text-sm text-zinc-500">
          Add expenses to see your spending breakdown
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 min-w-0">
      <h2 className="text-base font-semibold text-[#d1d1d1] mb-5 tracking-tight">
        Spending Breakdown
      </h2>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="w-full h-[220px] min-w-0 min-h-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={86}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      CATEGORY_COLORS[entry.name] ||
                      CATEGORY_COLORS.Other
                    }
                    stroke="transparent"
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 min-w-[160px] w-full lg:w-auto">
          {data.map((entry) => {
            const color =
              CATEGORY_COLORS[entry.name] ||
              CATEGORY_COLORS.Other;

            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />

                  <span className="text-sm text-zinc-400 truncate">
                    {entry.name}
                  </span>
                </div>

                <span className="text-xs text-zinc-500 tabular-nums">
                  {formatCurrency(entry.value, currency)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}