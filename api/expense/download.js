// /pages/api/expense/download.js
import dbConnect from "../../utils/dbConnect";
import Expense from "../../models/Expense";
import xlsx from "xlsx";
import { protect } from "../../utils/protect";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const user = await protect(req, res);
  if (!user) return;

  try {
    const expenses = await Expense.find({ userId: user._id }).sort({
      date: -1,
    });
    const data = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
    }));

    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workBook, workSheet, "Expenses");

    const buf = xlsx.write(workBook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="expense_details.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.status(200).send(buf);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
