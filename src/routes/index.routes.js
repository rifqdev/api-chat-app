const express = require("express");
const router = express.Router();
const authRoutes = require("../modules/auth/auth.routes");
const forgotPasswordRoutes = require("../modules/forgot-password/forgot-password.routes");
const personsRoutes = require("../modules/persons/persons.routes");
const userRoutes = require("../modules/users/user.routes");

router.use("/auth", authRoutes);
router.use("/forgot-password", forgotPasswordRoutes);
router.use("/friends", personsRoutes);
router.use("/user", userRoutes);

module.exports = router;
