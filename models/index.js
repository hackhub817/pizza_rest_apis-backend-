// const User = require("./user");
// console.log(User);
// module.exports=User;
const User = require('./user');
console.log(User);
//module.exports = { User };
//exports.default = User

const RefreshToken = require("./refreshToken");
const Product = require("./product");

module.exports={User,RefreshToken,Product};

