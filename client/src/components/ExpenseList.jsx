import React from 'react';

function ExpenseList({ expenses, onDelete }) {
  return (
    <ul className="list-group">
      {expenses.map((expense) => (
        <li key={expense._id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            ₹{expense.amount} - {expense.category} ({expense.description})
          </div>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(expense._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;