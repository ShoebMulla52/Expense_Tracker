
import { useEffect, useState } from "react";
import './App.css';




function App() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenses, setExpenses] = useState(() => {
    return JSON.parse(localStorage.getItem("expenses")) || [];
  });

  // Save to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const totalAmount = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const addExpense = (e) => {
    e.preventDefault();

    if (!expenseName.trim() || expenseAmount <= 0) return;

    const newExpense = {
      id: Date.now(),
      name: expenseName,
      amount: parseFloat(expenseAmount),
    };

    setExpenses([...expenses, newExpense]);
    setExpenseName("");
    setExpenseAmount("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <form onSubmit={addExpense}>
        <input
          type="text"
          placeholder="Expense name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          required
        />
        <button type="submit">Add Expense</button>
      </form>

      <h2>Expenses</h2>

      <ul id="expense-list">
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.name} - ₹{expense.amount.toFixed(2)}
            <button onClick={() => deleteExpense(expense.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div id="total">
        <h3>
          Total: ₹<span id="total-amount">{totalAmount.toFixed(2)}</span>
        </h3>
      </div>
    </div>
  );
}

export default App;


