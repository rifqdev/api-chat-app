const express = require("express");
const router = express.Router();
const authController = require("./auth.controllers");
const jwt = require("../../middlewares/jwt");

router.post("/login", authController.login);
router.post("/refresh-token", jwt.verifyToken, authController.refreshToken);
router.post("/register", authController.register);

module.exports = router;
