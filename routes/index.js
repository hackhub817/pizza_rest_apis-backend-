const express = require("express");

const router=express.Router();
//importing logic of regidter route from the controller folder or auth folder
const {registerController,loginController}=require("../controllers");

// register logic

router.post("/register",registerController.register);
router.post("/login",loginController.login);

module.exports=router;