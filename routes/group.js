const mongoose =  require("mongoose");



const groupSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  profileImage: {
    type: String,
    default: "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
  }
  
});



module.exports = mongoose.model("group", groupSchema);