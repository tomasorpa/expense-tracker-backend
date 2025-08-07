const express = require("express");
// controllers
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
} = require("../controllers/expenseController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get", protect, getAllExpense);
router.post("/add", protect, addExpense);
router.get("/downloadexcel", protect, downloadExpenseExcel);
router.delete("/:id", protect, deleteExpense);

module.exports = router;
