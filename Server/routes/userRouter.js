const express=require("express");
const router=express.Router();
const middleware=require("../middleware/auth");

const userController=require("../controller/userController");

router.post("/add",userController.addUsers);
router.post("/login",userController.loginUser);



module.exports=router;