const Expense = require("../models/Expense");
const { validateExpenseInput } = require("../utils/validator");

const createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date } = req.body;
    const { errors, isValid } = validateExpenseInput({ amount, category });
    if (!isValid) return res.status(400).json(errors);

    const expense = await Expense.create({
      user: req.user.id,
      amount,
      category,
      description,
      date,
    });
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
  res.json(expenses);
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  const updated = await Expense.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};


const deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
};


module.exports = {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense
};
