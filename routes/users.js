const mongoose =  require("mongoose");
const passport = require("passport");
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/clone");

const userSchema = mongoose.Schema({
  username: {
    type: String,
   
  },
  email: {
    type: String,
  },
  contact: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  socketId: {
    type: String,
  },
  profileImage: {
    type: String,
    default: "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
  }
});


userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);