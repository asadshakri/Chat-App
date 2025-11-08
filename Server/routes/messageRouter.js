const express=require("express");
const router=express.Router();
const middleware=require("../middleware/auth");

const messageController=require("../controller/messageController");

router.post("/add",middleware.authenticate,messageController.addMessage);
router.get("/get",messageController.fetchMessages);

module.exports=router;