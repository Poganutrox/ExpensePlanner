import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { ChangeEvent, useEffect, useState } from "react";
import { DraftExpense, Value } from "../types";
import ErrorMesasge from "./ErrorMesasge";
import { useBudget } from "../hooks/useBudget";

const ExpenseForm = () => {
  const initialExpense = {
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date(),
  };
  const [expense, setExpense] = useState<DraftExpense>(initialExpense);

  const [error, setError] = useState("");

  const [previousAmount, setPreviousAmount] = useState(0);

  const { state, dispatch, remainingBudget } = useBudget();

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter(
        (expense) => expense.id === state.editingId
      )[0];
      setExpense(editingExpense);
      setPreviousAmount(editingExpense.amount);
    }
  }, [state.editingId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isAmountField = ["amount"].includes(name);
    setExpense((prevVal) => ({
      ...prevVal,
      [name]: isAmountField ? +value : value,
    }));
  };
  const handleDate = (value: Value) =>
    setExpense((preVal) => ({ ...preVal, date: value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(expense).includes("")) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (expense.amount - previousAmount > remainingBudget) {
      setError("El gasto sobrepasa el presupuesto");
      return;
    }

    if (state.editingId) {
      dispatch({
        type: "update-expense",
        payload: { expense: { id: state.editingId, ...expense } },
      });
    } else {
      dispatch({ type: "add-expense", payload: { expense } });
    }
    setExpense(initialExpense);
    setPreviousAmount(0);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500">
        {state.editingId ? "Edit Expense" : "New Expense"}
      </legend>
      {error && <ErrorMesasge>{error}</ErrorMesasge>}
      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Name Expense:
        </label>
        <input
          id="expenseName"
          type="text"
          placeholder="Add the name of the expense"
          className="bg-slate-100 p-2"
          name="expenseName"
          value={expense.expenseName}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Amount:
        </label>
        <input
          id="amount"
          type="number"
          placeholder="Add the amount of expenditure: e.g. 300"
          className="bg-slate-100 p-2"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">
          Category:
        </label>
        <select
          id="category"
          className="bg-slate-100 p-2"
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="">-- Select --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Date Expenditure:
        </label>
        <DatePicker
          className="bg-slate-100 p-2 border-0"
          value={expense.date}
          onChange={handleDate}
        />
      </div>
      <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
        value={state.editingId ? "Save changes" : "Record Expense"}
      />
    </form>
  );
};

export default ExpenseForm;
