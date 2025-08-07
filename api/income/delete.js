
import dbConnect from "../../utils/dbConnect";
import Income from "../../models/Income";
import { protect } from "../../utils/protect";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
      await dbConnect();
      const user = await protect(req, res);
        if (!user) return;
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ message: `Expense id:${id} does not exist` });
    }

    await Income.findByIdAndDelete(id);
    return res.status(200).json({ message: "Income Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
}
