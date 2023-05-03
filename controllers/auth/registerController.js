
const Joi = require("joi");

const JwtService= require("../../services/JwtService");
//THIS IS USED TO HASH THE PASSWORD
const  bcrypt = require("bcrypt");

const {User}  = require("../../models");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const registerController={
   async register(req,res,next){
     // validation 
     const registerSchema=Joi.object({
        name:Joi.string().min(3).max(30).required(),
        email:Joi.string().email().required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password:Joi.ref('password')
     });
     
     const {error} = registerSchema.validate(req.body);
     
     if(error){
        return next(error);                                           
     }
     

     //CHECK IF USER IN THE DATABASE ALREADY


     try {
      console.log(req.body.email);
      console.log(User);
      const exist = await  User.exists({ email: req.body.email });
      console.log(req.body.email);
      if (exist) {
          return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
      }
      console.log("hi");
  } catch(err) {
      return next(err);
  }
   
    //hASED PASSWORD
    
    //THIS LINE WILL HELP IN REOMVEAL OF REQ.BODY IN EVERY LINE
    // WE CAN DIRECTLY ASSIGN THE NAME AS NAME
    const {name , email , password}=req.body;
    console.log(req.body.name);
    console.log(email);
    console.log(password);

    const hashedPassword = await bcrypt.hash(password,10);
    // prepare the model

    const user = new User({
      name:name,
      email:email,
      password: hashedPassword
  });
   //  User.save();
    let access_token;
    try{
      const result=await user.save();

       console.log(result);
      //Toekn will be used
     access_token=JwtService.sign({_id:result._id,role: result.role});
     console.log(access_token);
    }
    catch(err)
    {
      console.log(err);
      return next(err);
    }


        res.json({access_token});
    }
}


// // controller
// const register = async (req, res) => {
//   try{
//     const registerSchema=Joi.object({
//       name:Joi.string().min(3).max(30).required(),
//       email:Joi.string().email().required(),
//       password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
//       repeat_password:Joi.ref('password')
//    });
   
//    const {error} = registerSchema.validate(req.body);
   
//    if(error){
//       throw res.send({ error: "Validation error" });                                         
//    }
//   }catch(err){
//     console.error(err);
//     return res.send({ error: "Server Error"});
//   }
// }

module.exports=registerController;