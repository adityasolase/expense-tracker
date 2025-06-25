import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import API from '../services/api';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await API.get('/expenses');
        setExpenses(res.data);
      } catch (err) {
        console.error('Failed to fetch expenses', err);
      }
    };
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter(exp => {
    const matchCategory = filterCategory ? exp.category === filterCategory : true;
    const matchDate = filterDate ? exp.date.slice(0, 10) === filterDate : true;
    return matchCategory && matchDate;
  });

  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: 'Expense Categories',
        data: Object.values(categoryTotals),
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
        borderWidth: 1,
      },
    ],
  };

  const monthlyTotals = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: Object.values(monthlyTotals),
        backgroundColor: '#007bff',
      },
    ],
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleEditChange = (e) => {
    setEditingExpense({ ...editingExpense, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/expenses/${editingExpense._id}`, editingExpense);
      setExpenses(expenses.map(exp => exp._id === editingExpense._id ? res.data : exp));
      setEditingExpense(null);
    } catch (err) {
      alert('Update failed');
    }
  };

  const uniqueCategories = [...new Set(expenses.map(exp => exp.category))];

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f0f4f8' }}>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#343a40' }}>
        <div className="container-fluid px-4 d-flex justify-content-between">
          <span className="navbar-brand mb-0 h1">Expense Dashboard</span>
          <button className="btn btn-outline-light" onClick={() => navigate('/main')}>Back to Main</button>
        </div>
      </nav>

      <div className="container py-5">
        <h2 className="text-center text-primary mb-4">Expense Analytics</h2>

        <div className="row mb-4">
          <div className="col-md-4">
            <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value=''>Filter by Category</option>
              {uniqueCategories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <input type="date" className="form-control" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
          <div className="col-md-4">
            <button className="btn btn-outline-secondary w-100" onClick={() => { setFilterCategory(''); setFilterDate(''); }}>Clear Filters</button>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-md-6 mb-4">
            <Pie data={pieData} />
          </div>
          <div className="col-md-6 mb-4">
            <Bar data={barData} />
          </div>
        </div>

        <h4 className="text-primary">All Expenses</h4>
        <table className="table table-bordered bg-white">
          <thead className="table-light">
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(exp => (
              <tr key={exp._id}>
                {editingExpense && editingExpense._id === exp._id ? (
                  <>
                    <td><input name="amount" className="form-control" value={editingExpense.amount} onChange={handleEditChange} /></td>
                    <td><input name="category" className="form-control" value={editingExpense.category} onChange={handleEditChange} /></td>
                    <td><input name="description" className="form-control" value={editingExpense.description} onChange={handleEditChange} /></td>
                    <td><input name="date" type="date" className="form-control" value={editingExpense.date?.slice(0,10)} onChange={handleEditChange} /></td>
                    <td>
                      <button className="btn btn-sm btn-success me-2" onClick={handleEditSubmit}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditingExpense(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>₹{exp.amount}</td>
                    <td>{exp.category}</td>
                    <td>{exp.description}</td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => setEditingExpense(exp)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
