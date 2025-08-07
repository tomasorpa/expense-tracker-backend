const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/getUser", protect, getUserInfo);
router.post("/upload-image", upload.single("image"),uploadImage);

//cuando lleguen los millones

module.exports = router;
