import Expense from "../../models/Expense";
import dbConnect from "../../utils/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ message: `Expense id:${id} does not exist` });
    }

    await Expense.findByIdAndDelete(id);
    return res.status(200).json({ message: "Expense Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
}
