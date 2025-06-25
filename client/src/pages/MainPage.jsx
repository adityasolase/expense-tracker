import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AddExpenseForm from '../components/AddExpenseForm';

function MainPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.name || 'User');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f0f4f8' }}>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#343a40' }}>
        <div className="container-fluid px-4 d-flex justify-content-between">
          <span className="navbar-brand mb-0 h1">Expense Tracker</span>
          <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container py-5">
        <h2 className="text-center text-primary mb-4">Hello, {username} !!</h2>
        <div className="d-flex justify-content-center gap-4 mb-4">
          <button className="btn btn-outline-primary px-4 py-2" onClick={() => navigate('/dashboard')}>
            View Expense Analytics
          </button>
          <button className="btn btn-primary px-4 py-2" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close Expense Form' : '+ Add New Expense'}
          </button>
        </div>
        {showForm && (
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-sm p-4">
                <AddExpenseForm onExpenseAdded={() => setShowForm(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;