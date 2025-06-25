const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const { validateUserInput } = require("../utils/validator");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name }, secret, { expiresIn: "7d" });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { errors, isValid } = validateUserInput({ name, email, password });
    if (!isValid) return res.status(400).json(errors);

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ token: generateToken(user) });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ token: generateToken(user) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
