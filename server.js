const express= require("express");
const {APP_PORT,DB_URL} = require("./config");
const routes= require("./routes");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorHandler");
const app=express();



//database connect
mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2",{
  dbName: 'restapi',
},{useNewUrlParser:true},).then(()=>console.log('connect database'))
.catch((err)=>{console.log(err);});


// //DATABASE CONNECTION
// // Database connection
// mongoose.connect(DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//     console.log('DB connected...');
// });

app.use(express.json());
app.use("/api",routes);


app.use(errorHandler);
app.listen(APP_PORT,()=>
console.log(`Listening  on port ${APP_PORT}`));
