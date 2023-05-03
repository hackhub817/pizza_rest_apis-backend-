const { User } = require("../../models");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const userController={

   async me(req,res,next)
    {
   //logic

   try{
    const user=await User.findOne({_id:req.user._id});
   if(!user)
   {
    return next(CustomErrorHandler.notFound());
   }
   res.json(user);
   
}
   catch(err)
   {
    return next(err);
   }
}
};

module.exports=userController;