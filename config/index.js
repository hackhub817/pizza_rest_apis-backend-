const dotenv=require("dotenv");

dotenv.config();

 const x= {
    APP_PORT,
    DEBUG_MODE,
    JWT_SECRET,
    REFRESH_SECRET,
    APP_URL
} =process.env;

module.exports=x;