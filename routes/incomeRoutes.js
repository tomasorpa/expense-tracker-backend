const express = require("express");
// controllers
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get", protect, getAllIncome);
router.post("/add", protect, addIncome);
router.get("/downloadexcel", protect, downloadIncomeExcel);
router.delete("/:id", protect, deleteIncome);

module.exports = router;
