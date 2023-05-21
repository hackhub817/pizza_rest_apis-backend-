const express = require("express");

const router=express.Router();
//importing logic of regidter route from the controller folder or auth folder
const {registerController,loginController,userController,refreshController}=require("../controllers");
const auth = require("../middlewares/auth");

// register logic

router.post("/register",registerController.register);
router.post("/login",loginController.login);
router.get("/me",auth,userController.me);
router.post("/refresh",refreshController.refresh);
router.post("/logout",auth,loginController.logout);

module.exports=router;