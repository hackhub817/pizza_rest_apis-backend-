const dotenv=require("dotenv");

dotenv.config();

 const x= {
    APP_PORT,
    DEBUG_MODE,
    JWT_SECRET
} =process.env;

module.exports=x;