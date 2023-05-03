const express = require("express");

const router=express.Router();
//importing logic of regidter route from the controller folder or auth folder
const registerController=require("../controllers");

// register logic

router.post("/register",registerController.register);


module.exports=router;