import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "./App.css";

function App() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenses, setExpenses] = useState(() => {
    return JSON.parse(localStorage.getItem("expenses")) || [];
  });

  // Save expenses to localStorage
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

  // 📄 Generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Expense Report", 14, 20);

    doc.setFontSize(12);
    let yPosition = 30;

    expenses.forEach((expense, index) => {
      doc.text(
        `${index + 1}. ${expense.name} - ₹${expense.amount.toFixed(2)}`,
        14,
        yPosition
      );
      yPosition += 8;
    });

    yPosition += 5;
    doc.setFontSize(14);
    doc.text(`Total: ₹${totalAmount.toFixed(2)}`, 14, yPosition);

    doc.save("expenses.pdf");
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
            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div id="total">
        <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
      </div>

      {expenses.length > 0 && (
        <button className="pdf-btn" onClick={downloadPDF}>
          Download PDF
        </button>
      )}
    </div>
  );
}

export default App;

