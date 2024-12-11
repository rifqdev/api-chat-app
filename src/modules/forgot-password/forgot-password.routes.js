const express = require("express");
const router = express.Router();
const forgotPasswordController = require("./forgot-password.controllers");

router.post("/request-code", forgotPasswordController.resetPassword);
router.post("/update-password", forgotPasswordController.updatePassword);
router.post("/resend-code", forgotPasswordController.resendCode);
module.exports = router;
