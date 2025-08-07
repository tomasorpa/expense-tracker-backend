import Expense from "../../models/Expense";
import dbConnect from "../../utils/dbConnect";
import { protect } from "../../utils/protect";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const user = await protect(req, res);
  if (!user) return;
  try {
    const allExpense = await Expense.find({ userId: user._id }).sort({
      date: -1,
    });
    return res.status(200).json(allExpense);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
}
