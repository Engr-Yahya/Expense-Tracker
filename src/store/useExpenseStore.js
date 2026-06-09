// src/store/useExpenseStore.js
import { create } from "zustand";

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

const useExpenseStore = create((set, get) => ({
  expenses: loadFromStorage(),
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