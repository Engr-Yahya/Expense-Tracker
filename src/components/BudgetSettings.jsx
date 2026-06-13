import { useState } from "react";
import useExpenseStore, { CATEGORIES } from "../store/useExpenseStore";
import { getCurrencySymbol } from "../utils/formatCurrency";

const inputClass =
  "bg-zinc-900 border border-zinc-700 text-[#d1d1d1] placeholder-zinc-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d1d1d1] transition w-full";

export default function BudgetSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [localBudgets, setLocalBudgets] = useState({});
  const budgets = useExpenseStore((s) => s.budgets);
  const setBudget = useExpenseStore((s) => s.setBudget);
  const currency = useExpenseStore((s) => s.currency);

  const handleOpen = () => {
    setLocalBudgets({ ...budgets });
    setIsOpen(true);
  };

  const handleSave = () => {
    CATEGORIES.forEach((cat) => {
      const amount = parseFloat(localBudgets[cat] || 0);
      if (amount >= 0) {
        setBudget(cat, amount);
      }
    });
    setIsOpen(false);
  };

  const handleChange = (category, value) => {
    const numValue = value.replace(/[^0-9.]/g, "");
    const parts = numValue.split(".");
    if (parts.length > 2) return;
    if (parts[1]?.length > 2) return;
    setLocalBudgets((prev) => ({
      ...prev,
      [category]: numValue,
    }));
  };

  const hasBudgets = Object.keys(budgets).length > 0;

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 h-[44px] rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-400 transition-all duration-200 hover:border-zinc-600 hover:text-[#d1d1d1]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        {hasBudgets ? "Edit Budgets" : "Set Budgets"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#d1d1d1]">Set Monthly Budgets</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-600 hover:text-[#d1d1d1] transition text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    {category}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-600">{getCurrencySymbol(currency)}</span>
                    <input
                      type="text"
                      value={localBudgets[category] || ""}
                      onChange={(e) => handleChange(category, e.target.value)}
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 h-10 rounded-xl border border-zinc-700 text-sm font-medium text-zinc-400 hover:border-zinc-600 hover:text-[#d1d1d1] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 h-10 rounded-xl bg-[#d1d1d1] text-black text-sm font-medium hover:bg-white transition"
              >
                Save Budgets
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
