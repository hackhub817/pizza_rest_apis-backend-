
const Joi=require("joi");
const { User ,RefreshToken } = require("../../models");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const bcrypt=require("bcrypt");
const JwtService=require("../../services/JwtService"); 
// const RefreshToken = require("../../models");
const{REFRESH_SECRET}=require("../../config");
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
    
    const access_token=JwtService.sign({_id:user.id,role: user.role});
    const refresh_token=JwtService.sign({_id:user._id,role: user.role},'1y',REFRESH_SECRET);
     
    //STORE REFRESH TOKEN INTO THE DATA BASE
    //FOR THAT CREATE DATABASE FIRST
      
    await RefreshToken.create({token:refresh_token});
    res.json({access_token , refresh_token});
    
    }
    catch(err)
    {
     return next(err);
    }
  },

async logout(req ,res , next)
{

  //validation
  const logSchema=Joi.object({
    refresh_token:Joi.string().required()
     });

const {error}=logSchema.validate(req.body);
if(error){
    return next(error);
}
  //delete the refrsh token and you will be logout
  try{
    await RefreshToken.deleteOne({token:req.body.refresh_token});

  }
  catch(err)
  {
    return next(new Error('Something went wrong'));
  }
 
  res.json({status:1});
}
};




module.exports=loginController;