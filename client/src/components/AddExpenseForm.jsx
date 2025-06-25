import React, { useState } from 'react';
import API from '../services/api';

function AddExpenseForm({ onExpenseAdded }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/expenses', formData);
      onExpenseAdded();
      setFormData({ amount: '', category: '', description: '', date: '' });
      alert('Expense added successfully!');
    } catch (err) {
      alert('Failed to add expense.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h4 className="text-primary mb-3">Add New Expense</h4>
      <div className="mb-3">
        <input type="number" name="amount" placeholder="Amount" className="form-control" value={formData.amount} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <input type="text" name="category" placeholder="Category" className="form-control" value={formData.category} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <input type="text" name="description" placeholder="Description" className="form-control" value={formData.description} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
      </div>
      <button type="submit" className="btn btn-primary w-100">Add Expense</button>
    </form>
  );
}

export default AddExpenseForm;
