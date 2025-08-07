import upload from "../utils/upload"; // multer configurado
import { createRouter } from "next-connect";
import cloudinary from "cloudinary";

export default async function handler(req, res) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.v2.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_SECRET
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ timestamp, signature });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
