import nextConnect from "next-connect";
import upload from "../../utils/upload"; // <-- el adaptado a Cloudinary

const handler = nextConnect();

handler.use(upload.single("image")); // nombre del input en form-data

handler.post(async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  return res.status(200).json({ imageUrl: req.file.path });
});

export const config = {
  api: {
    bodyParser: false, // importante para que funcione multer
  },
};

export default handler;
