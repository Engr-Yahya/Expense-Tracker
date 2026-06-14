import AddExpenseForm from "./components/AddExpenseForm";
import SummaryCards from "./components/SummaryCards";
import FilterBar from "./components/FilterBar";
import SpendingChart from "./components/SpendingChart";
import ExpenseList from "./components/ExpenseList";
import BudgetSettings from "./components/BudgetSettings";
import BudgetStatus from "./components/BudgetStatus";
import CurrencySelector from "./components/CurrencySelector";
import "./styles/datepicker.css";

export default function App() {
  return (
    <div className="min-h-screen bg-black px-4 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        <div className="border-b border-zinc-900 pb-6">
          <p className="text-xs font-semibold tracking-[0.25em] text-zinc-600 uppercase mb-2">
            Personal Finance
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#d1d1d1]">
            Expense Tracker
          </h1>
          <p className="text-sm text-zinc-600 mt-2">Stay on top of every dollar you spend</p>
        </div>

        {/* Controls row — stacks vertically on mobile, right-aligned on desktop */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
          <CurrencySelector />
          <BudgetSettings />
        </div>

        <SummaryCards />

        <BudgetStatus />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AddExpenseForm />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-6">
            <SpendingChart />
            <FilterBar />
            <ExpenseList />
          </div>
        </div>

      </div>
    </div>
  );
}