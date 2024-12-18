const express = require("express");
const router = express.Router();
const jwt = require("../../middlewares/jwt");
const userController = require("./user.controllers");
const { upload } = require("../../utils/upload");

router.get("/details", jwt.verifyToken, userController.getUser);
router.put("/update-bio", jwt.verifyToken, userController.updateBio);
router.put("/update-fullname", jwt.verifyToken, userController.updateFullname);
router.put("/update-username", jwt.verifyToken, userController.updateUsername);
router.put("/update-profile-picture", jwt.verifyToken, upload.single("photo"), userController.updateProfilePicture);

module.exports = router;
