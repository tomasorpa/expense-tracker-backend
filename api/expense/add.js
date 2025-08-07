import Expense from "../../models/Expense";
import dbConnect from "../../utils/dbConnect";
import { protect } from "../../utils/protect";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const user = await protect(req, res);
  if (!user) return;

  const { icon, category, amount, date } = req.body;

  if (!date || !category || !amount)
    return res.status(400).json({ message: "All Fields Required" });

  try {
    const newExpense = new Expense({
      userId: user._id,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
