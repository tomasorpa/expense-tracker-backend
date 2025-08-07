const express = require("express");
// controllers
const { getDashboardData } = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get", protect, getDashboardData);

module.exports = router;


