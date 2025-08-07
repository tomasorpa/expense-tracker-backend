const { response } = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1hr" });
};
exports.registerUser = async (req, res = response) => {
  const { fullName, email, password, profileImageUrl } = req.body;
  try {
    if ((!fullName, !email, !password)) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }
    const isUserRegistered = await User.findOne({ email });
    if (isUserRegistered) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });
    return res.status(201).json({
      _id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error trying to register the user",
      error: error.message,
    });
  }
};
exports.loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      message: "All fields are required",
    });

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        message: "Email is not registered",
      });

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return res.status(400).json({
        message: "Password does not match",
      });

    return res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error trying to log in user",
      error: error.message,
    });
  }
};
exports.getUserInfo = async (req, res = response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status.json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error trying to get the user",
      error: error.message,
    });
  }
};
