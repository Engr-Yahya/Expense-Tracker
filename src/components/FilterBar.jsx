import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import useExpenseStore, { CATEGORIES } from "../store/useExpenseStore";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#09090b",
    border: `1px solid ${state.isFocused ? "#d1d1d1" : "#27272a"}`,
    borderRadius: "14px",
    minHeight: "44px",
    minWidth: "220px",
    boxShadow: "none",
    padding: "0 6px",
    transition: "all 0.2s ease",
    cursor: "pointer",

    "&:hover": {
      borderColor: "#52525b",
    },
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "#111",
    border: "1px solid #27272a",
    borderRadius: "14px",
    overflow: "hidden",
    padding: "6px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "#1f1f23"
      : state.isSelected
        ? "#d1d1d1"
        : "transparent",

    color: state.isSelected ? "#000" : "#d4d4d8",
    borderRadius: "10px",
    fontSize: "14px",
    padding: "10px 12px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontWeight: state.isSelected ? 600 : 400,
  }),

  singleValue: (base) => ({
    ...base,
    color: "#d1d1d1",
    fontSize: "14px",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#71717a",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#71717a",

    "&:hover": {
      color: "#d1d1d1",
    },
  }),
};

const categoryOptions = [
  { value: "All", label: "All Categories" },
  ...CATEGORIES.map((c) => ({
    value: c,
    label: c,
  })),
];

export default function FilterBar() {
  const filterCategory = useExpenseStore((s) => s.filterCategory);

  const filterMonth = useExpenseStore((s) => s.filterMonth);

  const setFilterCategory = useExpenseStore((s) => s.setFilterCategory);

  const setFilterMonth = useExpenseStore((s) => s.setFilterMonth);

  const selectedOption = categoryOptions.find(
    (o) => o.value === filterCategory,
  );

  const selectedMonth = filterMonth ? new Date(`${filterMonth}-01`) : null;

  const handleMonthChange = (date) => {
    if (!date) {
      setFilterMonth("");
      return;
    }

    // Prevent timezone month shifting bug
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    setFilterMonth(`${year}-${month}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <Select
        options={categoryOptions}
        value={selectedOption}
        onChange={(val) => setFilterCategory(val?.value || "All")}
        styles={selectStyles}
        isSearchable={false}
      />

      <DatePicker
        selected={selectedMonth}
        onChange={handleMonthChange}
        dateFormat="MMM yyyy"
        showMonthYearPicker
        placeholderText="Filter by month"
        isClearable
        popperPlacement="bottom-start"
        className="
          h-[44px]
          w-[220px]
          rounded-[14px]
          border
          border-zinc-800
          bg-zinc-950
          px-4
          text-sm
          text-[#d1d1d1]
          placeholder:text-zinc-500
          outline-none
          transition-all
          duration-200
          focus:border-[#d1d1d1]
          hover:border-zinc-600
        "
      />

      {(filterCategory !== "All" || filterMonth) && (
        <button
          onClick={() => {
            setFilterCategory("All");
            setFilterMonth("");
          }}
          className="
            h-[44px]
            rounded-[14px]
            border
            border-zinc-800
            bg-zinc-950
            px-4
            text-sm
            text-zinc-400
            transition-all
            duration-200
            hover:border-zinc-600
            hover:text-[#d1d1d1]
          "
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
