// pages/api/income.js

import dbConnect from "../../utils/dbConnect";
import Income from "../../models/Income";
import { protect } from "../../utils/protect";
import xlsx from "xlsx";

export default async function handler(req, res) {
  await dbConnect();
  const user = await protect(req, res);
  if (!user) return;

  const { method, query } = req;
  const action = query.action;

  try {
    if (method === "GET") {
      if (action === "download") {
        const income = await Income.find({ userId: user._id }).sort({
          date: -1,
        });
        const data = income.map((item) => ({
          Source: item.source,
          Amount: item.amount,
          Date: item.date.toISOString().split("T")[0],
        }));

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Income");

        const buffer = xlsx.write(workbook, {
          type: "buffer",
          bookType: "xlsx",
        });

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=income_details.xlsx"
        );
        return res.status(200).send(buffer);
      } else {
        const allIncome = await Income.find({ userId: user._id }).sort({
          date: -1,
        });
        return res.status(200).json(allIncome);
      }
    }

    if (method === "POST" && action === "add") {
      const { icon, source, amount, date } = req.body;
      if (!date || !source || !amount) {
        return res.status(400).json({ message: "All Fields Required" });
      }

      const newIncome = new Income({
        userId: user._id,
        icon,
        source,
        amount,
        date: new Date(date),
      });

      await newIncome.save();
      return res.status(201).json(newIncome);
    }

    if (method === "DELETE" && action === "delete") {
      const { id } = query;
      if (!id) return res.status(400).json({ message: "Income ID required" });

      await Income.findByIdAndDelete(id);
      return res.status(200).json({ message: "Income Deleted Successfully" });
    }

    return res
      .status(405)
      .json({ message: "Invalid method or missing action param" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
}
