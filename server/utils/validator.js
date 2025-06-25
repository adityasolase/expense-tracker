const validateExpenseInput = ({ amount, category }) => {
  const errors = {};

  if (!amount || isNaN(amount) || amount <= 0) {
    errors.amount = "Amount must be a positive number";
  }

  if (!category || typeof category !== "string" || category.trim() === "") {
    errors.category = "Category is required and must be a string";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const validateUserInput = ({ name, email, password }) => {
  const errors = {};

  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.name = "Name is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "A valid email is required";
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = {
  validateExpenseInput,
  validateUserInput,
};