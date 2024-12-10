const express = require("express");
const router = express.Router();
const userController = require("./user.controllers");
const jwt = require("../../middlewares/jwt");

router.post("/login", userController.login);
router.post("/refresh-token", jwt.verifyToken, userController.refreshToken);

module.exports = router;
