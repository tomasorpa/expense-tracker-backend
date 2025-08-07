import jwt from "jsonwebtoken";
import User from "../models/User";

export async function protect(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authorized, No Token" });
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "Not authorized, User not found" });
      return null;
    }
    return user;
  } catch (error) {
    res.status(401).json({ message: "Not authorized, Invalid Token" });
    return null;
  }
}
