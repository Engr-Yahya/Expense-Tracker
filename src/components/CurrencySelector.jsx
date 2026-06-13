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
    backgroundColor: "#09090b",
    border: `1px solid ${state.isFocused ? "#d1d1d1" : "#27272a"}`,
    borderRadius: "14px",
    minHeight: "44px",
    minWidth: "280px",
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

export default function CurrencySelector() {
  const currency = useExpenseStore((s) => s.currency);
  const setCurrency = useExpenseStore((s) => s.setCurrency);

  const selectedOption = currencyOptions.find((opt) => opt.value === currency);

  return (
    <Select
      options={currencyOptions}
      value={selectedOption}
      onChange={(opt) => opt && setCurrency(opt.value)}
      styles={selectStyles}
      isSearchable={true}
      placeholder="Select Currency"
    />
  );
}
