import Income from "../../models/Income";
import dbConnect from "../../utils/dbConnect";
import { protect } from "../../utils/protect";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const user = await protect(req, res);
  if (!user) return;

  const { icon, source, amount, date } = req.body;

  if (!date || !source || !amount)
    return res.status(400).json({ message: "All Fields Required" });

  try {
    const newIncome = new Income({
      userId: user._id,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
