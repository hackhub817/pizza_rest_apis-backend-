// jitne bhi controller h saare ham iss file ke through bhejegay 
const registerController=require("./auth/registerController");
const loginController=require("./auth/loginController");
const userController=require("./auth/userController");


module.exports={registerController,loginController,userController};