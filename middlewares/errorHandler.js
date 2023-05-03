
//IMPORTING DEBUG MODE KYUKI WOH BATAYEGA KI ERROR HAM SABKO DIKHA SKTAY H YA NAHI
const {DEBUG_MODE}=require('../config');

//joi hame type of error degay ki kis type ka erroe aa raha h
const {ValidationError}=require("joi");
const CustomErrorHandler = require('../services/CustomErrorHandler');
//syntax of errorHandler
const errorHandler = (err,req,res,next)=>{
  let statusCode = 500;
  
  let data={
    message:'Internal Server Error',
    ...(DEBUG_MODE==='true' && {originalError:err.message})
  }

  if(err instanceof ValidationError)
  {
   statusCode=422;
   data=
   {
    message:err.message
   }
  }

  if(err instanceof CustomErrorHandler)
  {
   statusCode=err.status;// class ke upper se hame status and message kiya h
   data={
    message:err.message
   }
   
  }

  return res.status(statusCode).json(data);

}

module.exports=errorHandler;

