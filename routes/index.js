const express = require("express");

const router=express.Router();
//importing logic of regidter route from the controller folder or auth folder
const {registerController,productController,loginController,userController,refreshController}=require("../controllers");
const auth = require("../middlewares/auth");
const admin=require("../middlewares/admin");
// register logic

router.post("/register",registerController.register);
router.post("/login",loginController.login);
router.get("/me",auth,userController.me);
router.post("/refresh",refreshController.refresh);
router.post("/logout",auth,loginController.logout);


router.post("/products",[auth,admin],productController.store);
router.put('/products/:id', [auth, admin], productController.update);
router.delete('/products/:id', [auth, admin], productController.destroy);
router.get('/products', productController.index);
router.get('/products/:id', productController.show);

module.exports=router;