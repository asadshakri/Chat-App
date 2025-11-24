const express = require("express");
const router = express.Router();

const chatController = require("../controller/chatListContoller");
const middleware=require("../middleware/auth");


router.get("/list", middleware.authenticate, chatController.getChatList);

module.exports = router;