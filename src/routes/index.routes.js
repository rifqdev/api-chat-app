const express = require("express");
const router = express.Router();
const authRoutes = require("../modules/auth/auth.routes");
const forgotPasswordRoutes = require("../modules/forgot-password/forgot-password.routes");

router.use("/auth", authRoutes);
router.use("/forgot-password", forgotPasswordRoutes);

module.exports = router;
