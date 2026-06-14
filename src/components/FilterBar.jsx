import Select from "react-select";
import DatePicker from "react-datepicker";
import useExpenseStore, { CATEGORIES } from "../store/useExpenseStore";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#09090b",
    border: `1px solid ${state.isFocused ? "#d1d1d1" : "#27272a"}`,
    borderRadius: "12px",
    minWidth: "0",        // removed hardcoded 220px — let flex/width handle sizing
    width: "100%",
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
    backgroundColor: state.isSelected
      ? "#d1d1d1"
      : state.isFocused
        ? "#1f1f23"
        : "transparent",
    color: state.isSelected ? "#000" : state.isFocused ? "#f8fafc" : "#d4d4d8",
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

  // Ensure the inner container doesn't clip or overflow
  container: (base) => ({
    ...base,
    width: "100%",
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    setFilterMonth(`${year}-${month}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
      {/* Category select — full width on mobile, auto on desktop */}
      <div className="w-full sm:w-auto sm:min-w-[220px]">
        <Select
          options={categoryOptions}
          value={selectedOption}
          onChange={(val) => setFilterCategory(val?.value || "All")}
          styles={selectStyles}
          isSearchable={false}
        />
      </div>

      {/* Date picker — full width on mobile, auto on desktop */}
      <DatePicker
        selected={selectedMonth}
        onChange={handleMonthChange}
        dateFormat="MMM yyyy"
        showMonthYearPicker
        placeholderText="Filter by month"
        isClearable
        popperPlacement="bottom-start"
        wrapperClassName="w-full sm:w-auto"
        className="
          w-full
          bg-zinc-950
          border
          border-zinc-700
          text-[#d1d1d1]
          placeholder-zinc-600
          rounded-xl
          px-4
          py-2.5
          text-sm
          focus:outline-none
          focus:border-[#d1d1d1]
          transition
          hover:border-zinc-600
        "
      />

      {/* Clear button — full width on mobile, auto on desktop */}
      {(filterCategory !== "All" || filterMonth) && (
        <button
          onClick={() => {
            setFilterCategory("All");
            setFilterMonth("");
          }}
          className="
            w-full
            sm:w-auto
            border
            border-zinc-700
            text-zinc-400
            rounded-xl
            px-4
            py-2.5
            text-sm
            transition
            hover:border-zinc-600
            hover:text-[#d1d1d1]
            active:scale-95
            cursor-pointer
          "
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}