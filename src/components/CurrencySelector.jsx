import { useState } from "react";
import Select from "react-select";
import useExpenseStore from "../store/useExpenseStore";
import { CURRENCIES } from "../constants/currencies";

const currencyOptions = CURRENCIES.map((curr) => ({
  value: curr.code,
  label: `${curr.symbol} ${curr.code} - ${curr.name}`,
  countries: curr.countries,
}));

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#18181b",
    border: `1px solid ${state.isFocused ? "#d1d1d1" : "#3f3f46"}`,
    borderRadius: "12px",
    minHeight: "44px",
    minWidth: "0",       // removed hardcoded 280px
    width: "100%",
    boxShadow: "none",
    padding: "2px 4px",
    transition: "border-color 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#d1d1d1",
    },
  }),

  container: (base) => ({
    ...base,
    width: "100%",
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "#111",
    border: "1px solid #27272a",
    borderRadius: "12px",
    overflow: "hidden",
    padding: "6px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  }),

  menuList: (base) => ({
    ...base,
    maxHeight: "220px",
    padding: "0",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#d1d1d1" : state.isFocused ? "#1f1f23" : "transparent",
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
};

export default function CurrencySelector() {
  const currency = useExpenseStore((s) => s.currency);
  const setCurrency = useExpenseStore((s) => s.setCurrency);

  const selectedOption = currencyOptions.find((opt) => opt.value === currency);

  return (
    <div className="w-full sm:w-auto sm:min-w-[280px]">
      <Select
        options={currencyOptions}
        value={selectedOption}
        onChange={(opt) => opt && setCurrency(opt.value)}
        styles={selectStyles}
        isSearchable={true}
        placeholder="Select Currency"
      />
    </div>
  );
}