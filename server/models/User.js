const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role : {
    type: String,
    default : "Visitor"
  },
});

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel



// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: {
//     unique : true,
//     type : String
//   },
//   password: String,
//   role : {
//     type: String,
//     default : "Visitor"
//   }
// });

// const UserModel = mongoose.model("users", UserSchema)
// module.exports = UserModel