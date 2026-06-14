const mongoose = require("mongoose");
const { verify } = require("node:crypto");
const { type } = require("node:os");

const userSchema = new mongoose.Schema({
      name : {
        type: String,
        required: true,
        trim: true
      },

      email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true
      },

      password : {
        type: String,
        required: true,
      },

      isVerified : {
        type: Boolean,
        default: false,
      },

      isAdmin : {
        type: Boolean,
        default: false,
      },

      verifyToken : String,
      resetToken : String,
} , {timestamps: true});

const User = mongoose.model("User",userSchema);
module.exports = User;