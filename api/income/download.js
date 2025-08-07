import Income from "../../models/Income";
import dbConnect from "../../utils/dbConnect";
import xlsx from "xlsx";
import { protect } from "../../utils/protect";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const user = await protect(req, res);
  if (!user) return; // ya envió error y terminó la ejecución
  const userId = user._id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
    }));

    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workBook, workSheet, "Income");

    const buffer = xlsx.write(workBook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_details.xlsx"
    );
    return res.status(200).send(buffer); // <-- importante poner return aquí
  } catch (error) {
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: "Server Error", error: error.message });
    }
    console.error("Error after headers sent:", error);
  }
}
