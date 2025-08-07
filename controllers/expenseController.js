const { response, request } = require("express");
const User = require("../models/User");
const Expense = require("../models/Expense");
const xlsx = require("xlsx");
exports.addExpense = async (req = request, res = response) => {
  const userId = req.user.id;
  try {
    const { icon, category, date, amount } = req.body;
    if (!category || !date || !amount)
      return res.status(400).json({
        message: "All fields required",
      });

    const newExpense = new Expense({
      userId,
      icon,
      category,
      date,
      amount,
    });
    await newExpense.save();

    return res.status(200).json(newExpense);
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
exports.getAllExpense = async (req, res = response) => {
  const userId = req.user.id;
  try {
    const allExpense = await Expense.find({ userId }).sort({ date: -1 });
    return res.status(200).json(allExpense);
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
exports.downloadExpenseExcel = async (req, res = response) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workBook, workSheet, "expense_details.xlsx");
    xlsx.writeFile(workBook, "expense_details.xlsx");
    return res.download("expense_details.xlsx");
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
exports.deleteExpense = async (req, res = response) => {
  const expenseId = req.params.id;
  try {
    if (!expenseId)
      return res
        .status(400)
        .json({ message: `Expense id:${expenseId} does not exist` });

    await Expense.findByIdAndDelete(expenseId);
    return res.status(200).json({
      message: "Expense Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
