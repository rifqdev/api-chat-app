const express = require("express");
const router = express.Router();
const chatsController = require("./chats.controllers");
const jwtMiddleware = require("../../middlewares/jwt");

router.get("/history/:friend_id", jwtMiddleware.verifyToken, chatsController.getHistoryChats);
router.get("/friend", jwtMiddleware.verifyToken, chatsController.getFriendChats);
router.post("/read", jwtMiddleware.verifyToken, chatsController.readChat);

module.exports = router;
