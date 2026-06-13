import { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import useExpenseStore, { CATEGORIES } from "../store/useExpenseStore";
import CurrencyInput from "react-currency-input-field";
import { getCurrencySymbol } from "../utils/formatCurrency";
const MAX_TITLE_LENGTH = 50;
const MAX_AMOUNT = 1000000;
const STEP = 1;

const defaultForm = {
  title: "",
  amount: "",
  category: {
    value: "Food",
    label: "Food",
  },
  date: new Date(),
};

const categoryOptions = CATEGORIES.map((c) => ({
  value: c,
  label: c,
}));

const inputClass =
  "bg-zinc-900 border border-zinc-700 text-[#d1d1d1] placeholder-zinc-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d1d1d1] transition w-full";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#18181b",
    border: `1px solid ${state.isFocused ? "#d1d1d1" : "#3f3f46"}`,
    borderRadius: "12px",
    padding: "2px 4px",
    boxShadow: "none",
    transition: "border-color 0.2s ease",
    "&:hover": {
      borderColor: "#d1d1d1",
    },
    cursor: "pointer",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#111",
    border: "1px solid #27272a",
    borderRadius: "12px",
    overflow: "hidden",
    padding: "4px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "220px",
    padding: "0",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#d1d1d1" : state.isFocused ? "#27272a" : "transparent",
    color: state.isSelected ? "#000" : state.isFocused ? "#f8fafc" : "#a1a1aa",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontWeight: state.isSelected ? 600 : 400,
  }),
  singleValue: (base) => ({
    ...base,
    color: "#d1d1d1",
    fontSize: "13px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#52525b",
    fontSize: "13px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#52525b",
    "&:hover": {
      color: "#d1d1d1",
    },
  }),
};

export default function AddExpenseForm() {
  const [form, setForm] = useState(defaultForm);

  const [error, setError] = useState("");

  const addExpense = useExpenseStore((s) => s.addExpense);
  const currency = useExpenseStore((s) => s.currency);

  const updateAmount = (value) => {
    value = value.replace(/[^0-9.]/g, "");

    const parts = value.split(".");

    if (parts.length > 2) return;

    if (parts[1]?.length > 2) return;

    const numeric = parseFloat(value);

    if (numeric > MAX_AMOUNT) return;

    setForm((f) => ({
      ...f,
      amount: value,
    }));
  };

  const incrementAmount = () => {
    const current = parseFloat(form.amount || 0);

    const next = Math.min(current + STEP, MAX_AMOUNT);

    setForm((f) => ({
      ...f,
      amount: next.toFixed(2),
    }));
  };

  const decrementAmount = () => {
    const current = parseFloat(form.amount || 0);

    const next = Math.max(current - STEP, 0);

    setForm((f) => ({
      ...f,
      amount: next.toFixed(2),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = form.title.trim();

    const amount = parseFloat(form.amount);

    if (!trimmedTitle) {
      return setError("Title is required");
    }

    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      return setError(`Title cannot exceed ${MAX_TITLE_LENGTH} characters`);
    }

    if (!form.amount || Number.isNaN(amount)) {
      return setError("Amount is required");
    }

    if (amount <= 0) {
      return setError("Amount must be greater than zero");
    }

    if (!form.date) {
      return setError("Please select a date");
    }

    addExpense({
      title: trimmedTitle,
      amount: Number(amount.toFixed(2)),
      category: form.category.value,
      date: form.date.toISOString().split("T")[0],
    });

    setForm(defaultForm);
    setError("");
  };

  return (
    <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800/60">
      <div className="mb-6">
        <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-[#d1d1d1]">
          New Entry
        </h2>

        <p className="text-xs text-zinc-600 mt-0.5">Record a transaction</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="text-xs text-red-400 bg-red-950/50 border border-red-900/50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-500 tracking-wide">
              Title
            </label>

            <span className="text-[11px] text-zinc-600">
              {form.title.length}
              /50
            </span>
          </div>

          <input
            value={form.title}
            maxLength={MAX_TITLE_LENGTH}
            onChange={(e) => {
              setError("");

              setForm((f) => ({
                ...f,
                title: e.target.value,
              }));
            }}
            placeholder="e.g. Netflix subscription"
            className={inputClass}
          />
        </div>

        {/* Amount */}
        {/* Amount */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-500 tracking-wide">
              Amount
            </label>

            <span className="text-[11px] text-zinc-600">Max $1,000,000</span>
          </div>

          <div className="relative">
            <CurrencyInput
              placeholder="0.00"
              value={form.amount}
              decimalsLimit={2}
              decimalScale={2}
              allowNegativeValue={false}
              maxLength={12}
              prefix={`${getCurrencySymbol(currency)} `}
              intlConfig={{
                locale: "en-US",
                currency: currency,
              }}
              onValueChange={(value) => {
                setError("");

                const numericValue = parseFloat(value || "0");

                if (numericValue > 1000000) {
                  return;
                }

                setForm((f) => ({
                  ...f,
                  amount: value || "",
                }));
              }}
              className={inputClass}
            />
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 tracking-wide">
            Date
          </label>
          <DatePicker
            selected={form.date}
            onChange={(date) =>
              setForm((f) => ({
                ...f,
                date,
              }))
            }
            dateFormat="MMM dd, yyyy"
            className={inputClass}
            placeholderText="Select date"
            popperPlacement="bottom-start"
          />
        </div>

        {/* Category */}
        <Select
          options={categoryOptions}
          value={form.category}
          onChange={(val) =>
            setForm((f) => ({
              ...f,
              category: val,
            }))
          }
          styles={selectStyles}
          isSearchable={false}
        />

        <button
          type="submit"
          className="mt-2 w-full py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all bg-[#d1d1d1] text-black hover:bg-white active:scale-95"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
