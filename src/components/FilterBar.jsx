import Select from "react-select";
import useExpenseStore, { CATEGORIES } from "../store/useExpenseStore";
import DatePicker from "react-datepicker";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#09090b",
    border: `1px solid ${state.isFocused ? "#d1d1d1" : "#3f3f46"}`,
    borderRadius: "12px",
    padding: "0px 4px",
    minWidth: "170px",
    boxShadow: "none",
    "&:hover": { borderColor: "#71717a" },
    cursor: "pointer",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#111",
    border: "1px solid #27272a",
    borderRadius: "12px",
    overflow: "hidden",
    padding: "4px",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#27272a" : "transparent",
    color: state.isSelected ? "#000" : "#a1a1aa",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    ...(state.isSelected && {
      backgroundColor: "#d1d1d1",
      color: "#000",
      fontWeight: 600,
    }),
  }),
  singleValue: (base) => ({ ...base, color: "#d1d1d1", fontSize: "13px" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, color: "#52525b", "&:hover": { color: "#d1d1d1" } }),
};

const categoryOptions = [
  { value: "All", label: "All Categories" },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

export default function FilterBar() {
  const filterCategory = useExpenseStore((s) => s.filterCategory);
  const filterMonth = useExpenseStore((s) => s.filterMonth);
  const setFilterCategory = useExpenseStore((s) => s.setFilterCategory);
  const setFilterMonth = useExpenseStore((s) => s.setFilterMonth);

  const selectedOption = categoryOptions.find((o) => o.value === filterCategory);
  const selectedMonth = filterMonth ? new Date(filterMonth + "-01") : null;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select
        options={categoryOptions}
        value={selectedOption}
        onChange={(val) => setFilterCategory(val.value)}
        styles={selectStyles}
        isSearchable={false}
      />

      <DatePicker
        selected={selectedMonth}
        onChange={(date) =>
          setFilterMonth(date ? date.toISOString().slice(0, 7) : "")
        }
        dateFormat="MMM yyyy"
        showMonthYearPicker
        placeholderText="Filter by month"
        isClearable
        className="bg-zinc-950 border border-zinc-700 text-[#d1d1d1] placeholder-zinc-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#d1d1d1] transition cursor-pointer w-44"
      />

      {(filterCategory !== "All" || filterMonth) && (
        <button
          onClick={() => { setFilterCategory("All"); setFilterMonth(""); }}
          className="text-xs text-zinc-500 hover:text-[#d1d1d1] border border-zinc-800 hover:border-zinc-600 px-3 py-2 rounded-xl transition"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}