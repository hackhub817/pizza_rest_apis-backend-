// const User = require("./user");
// console.log(User);
// module.exports=User;
const User = require('./user');
console.log(User);
//module.exports = { User };
//exports.default = User

const RefreshToken = require("./refreshToken");

module.exports={User,RefreshToken};

