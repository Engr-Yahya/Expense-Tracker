// src/store/useExpenseStore.js
import { create } from "zustand";
import { DEFAULT_CURRENCY } from "../constants/currencies";

const CATEGORIES = ["Food", "Transport", "Entertainment", "Shopping", "Health", "Bills", "Other"];

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem("expenses");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (expenses) => {
  localStorage.setItem("expenses", JSON.stringify(expenses));
};

const loadBudgetsFromStorage = () => {
  try {
    const data = localStorage.getItem("budgets");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveBudgetsToStorage = (budgets) => {
  localStorage.setItem("budgets", JSON.stringify(budgets));
};

const loadCurrencyFromStorage = () => {
  try {
    const data = localStorage.getItem("currency");
    return data ? JSON.parse(data) : DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
};

const saveCurrencyToStorage = (currency) => {
  localStorage.setItem("currency", JSON.stringify(currency));
};

const useExpenseStore = create((set, get) => ({
  expenses: loadFromStorage(),
  budgets: loadBudgetsFromStorage(),
  currency: loadCurrencyFromStorage(),
  filterCategory: "All",
  filterMonth: "",

  addExpense: (expense) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    const updated = [newExpense, ...get().expenses];
    saveToStorage(updated);
    set({ expenses: updated });
  },

  deleteExpense: (id) => {
    const updated = get().expenses.filter((e) => e.id !== id);
    saveToStorage(updated);
    set({ expenses: updated });
  },

  setCurrency: (currency) => {
    saveCurrencyToStorage(currency);
    set({ currency });
  },

  setBudget: (category, amount) => {
    const updated = { ...get().budgets, [category]: amount };
    saveBudgetsToStorage(updated);
    set({ budgets: updated });
  },

  getBudget: (category) => get().budgets[category] || 0,

  setFilterCategory: (category) => set({ filterCategory: category }),
  setFilterMonth: (month) => set({ filterMonth: month }),

  getFilteredExpenses: () => {
    const { expenses, filterCategory, filterMonth } = get();
    return expenses.filter((e) => {
      const matchCat = filterCategory === "All" || e.category === filterCategory;
      const matchMonth = !filterMonth || e.date.startsWith(filterMonth);
      return matchCat && matchMonth;
    });
  },

  getCategorySpent: (category, month) => {
    const { expenses } = get();
    return expenses
      .filter((e) => e.category === category && e.date.startsWith(month))
      .reduce((sum, e) => sum + e.amount, 0);
  },

  getTotalSpent: () => get().getFilteredExpenses().reduce((sum, e) => sum + e.amount, 0),

  getBiggestCategory: () => {
    const filtered = get().getFilteredExpenses();
    if (!filtered.length) return "—";
    const totals = {};
    filtered.forEach((e) => { totals[e.category] = (totals[e.category] || 0) + e.amount; });
    return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
  },

  getChartData: () => {
    const filtered = get().getFilteredExpenses();
    const totals = {};
    filtered.forEach((e) => { totals[e.category] = (totals[e.category] || 0) + e.amount; });
    return Object.entries(totals).map(([name, value]) => ({ name, value: +value.toFixed(2) }));
  },
}));

export { CATEGORIES };
export default useExpenseStore;