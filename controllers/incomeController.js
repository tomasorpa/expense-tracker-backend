const { response, request } = require("express");
const User = require("../models/User");
const Income = require("../models/Income");
const xlsx = require("xlsx");
exports.addIncome = async (req = request, res = response) => {
  const userId = req.user.id;
  try {
    const { icon, source, amount, date } = req.body;

    if (!date || !source || !amount)
      return res.status(400).json({
        message: "All Fields Required",
      });

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date), //pense que tambien se colocaba el date.now()
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
exports.getAllIncome = async (req, res = response) => {
  const userId = req.user.id;
  try {
    const allIncome = await Income.find({ userId }).sort({ date: -1 });
    return res.status(200).json(allIncome);
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
exports.downloadIncomeExcel = async (req, res = response) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workBook, workSheet, "Income");
    xlsx.writeFile(workBook, "income_details.xlsx");
    res.download("income_details.xlsx");
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
exports.deleteIncome = async (req, res = response) => {
  const incomeId = req.params.id;
  try {
    await Income.findByIdAndDelete(incomeId);
    res.status(200).json({
      message: "Income Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
