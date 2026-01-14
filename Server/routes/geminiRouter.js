const express=require('express');
const router=express.Router();
const geminiController=require("../controller/geminiController");

router.post("/suggest",geminiController.suggestText);

module.exports=router;