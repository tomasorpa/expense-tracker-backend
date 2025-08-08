import User from "../../models/User";
import { getUserFromRequest } from "../../utils/auth";
import dbConnect from "../../utils/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const userData = await getUserFromRequest(req);
    if (!userData || !userData.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userData.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: "Error trying to get the user",
      error: error.message,
    });
  }
}
