const express=require("express");
const router=express.Router();
const middleware=require("../middleware/auth");

const userController=require("../controller/userController");

router.post("/add",userController.addUsers);
router.post("/login",userController.loginUser);
router.post("/checkEmail",userController.emailCheck);
router.post("/createGroup",middleware.authenticate,userController.createGroup);
router.post("/joinGroup",middleware.authenticate,userController.joinGroup);

module.exports=router;