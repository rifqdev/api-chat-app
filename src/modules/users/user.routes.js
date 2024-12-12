const express = require("express");
const router = express.Router();
const jwt = require("../../middlewares/jwt");
const userController = require("./user.controllers");

router.get("/details", jwt.verifyToken, userController.getUser);
router.put("/update-bio", jwt.verifyToken, userController.updateBio);
router.put("/update-fullname", jwt.verifyToken, userController.updateFullname);
router.put("/update-username", jwt.verifyToken, userController.updateUsername);

module.exports = router;
