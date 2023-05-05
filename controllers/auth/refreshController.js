const Joi = require("joi");
const { RefreshToken,User } = require("../../models");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const JwtService = require("../../services/JwtService");
const {REFRESH_SECRET}= require("../../config");

const refreshController={
    async refresh(req,res,next)
    {
        const refreshSchema=Joi.object({
            refresh_token:Joi.string().required()
        });
    
        const {error}=refreshSchema.validate(req.body);
        if(error){
            return next(error);
        }

        //CHECK WHERE THE TOKEN IS IN THE DATABASE OR NOT 
        //IF THERE IS NO DATABASE THAT MEANS USER HAVE LOGED OUT
       let refreshtoken;
       try{

        refreshtoken= await RefreshToken.findOne({token:req.body.refresh_token});
       if(!refreshtoken)
       {
        return next(CustomErrorHandler.unAuthorized('Invalid'));

       }
       let userId;

       try{
             const {_id}=   await JwtService.verify(refreshtoken.token,REFRESH_SECRET);
             userId=_id;
     
            }
      catch(err)
       {
        return next(CustomErrorHandler.unAuthorized('Invalid'));
       }
      
       const user=User.find({_id:userId});
       if(!user)
       {
        return next(CustomErrorHandler.unAuthorized('No user found'));
            }

            //tokens created
            access_token=JwtService.sign({_id:user._id,role: user.role});
  
            refresh_token=JwtService.sign({_id:user._id,role: user.role},'1y',REFRESH_SECRET);
            
            //STORE REFRESH TOKEN INTO THE DATA BASE
            //FOR THAT CREATE DATABASE FIRST
              
            await RefreshToken.create({token:refresh_token});
        
       
       
               res.json({access_token,refresh_token});
           }
    catch(err)
       {
        return next(new Error('Something went Wrong'+err.message));
       }

    }
}

module.exports=refreshController;