**Expense Tracker**

A full-stack **Expense Tracker Application** built with **Node.js**, **Express.js**, **MongoDB**, and **React (Vite)** that allows users to register/login, manage expenses, and visualize spending trends using charts.


Getting Started

1. Clone the Repository

->git clone https://github.com/adityasolase/expense-tracker
->cd expense-tracker

2. Setup the Backend:

->cd server
->npm install
->npm run dev

Create .env file in server:
PORT=5000(express port or local backend server)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

3. Setup the Frontend:
   
->cd client
->npm install
->npm run dev

Frontend will run at: http://localhost:5173
Backend will run at: http://localhost:5000
