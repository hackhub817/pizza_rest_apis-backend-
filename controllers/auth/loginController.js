
const Joi=require("joi");
const { User } = require("../../models");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const bcrypt=require("bcrypt");
const JwtService=require("../../services/JwtService"); 

const loginController={
  async login(req,res,next)
  {
    const loginSchema=Joi.object({
        email:Joi.string().email().required(),
    password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
 
    });

    const {error}=loginSchema.validate(req.body);
    if(error){
        return next(error);
    }

    try{
   const user=await User.findOne({email:req.body.email});
    if(!user)
    {
        return next(CustomErrorHandler.wrongCredentials());
    }

    //compare

    const match=await bcrypt.compare(req.body.password ,user.password)
    if(!match)
    {
        return next(CustomErrorHandler.wrongCredentials());
   
    }
    
    access_token=JwtService.sign({_id:user.id,role: user.role});
   
    res.json({access_token});
    }
    catch(err)
    {
     return next(err);
    }
  }
};




module.exports=loginController;