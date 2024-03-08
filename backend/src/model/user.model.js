const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String
      
    },
    location: {
      type: String,
    },
    DateOfBirth: {
      type: Date,
    },
    followers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    // Similar to followers
    following: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// password hashing
userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 10);
});

// generate jwt token
userSchema.methods.generateToken = async function () {
  try {
    const userDetails = {
      id: this._id,
      firstName: this.firstName,
      isAdmin: this.isAdmin,
    };
    const token = await jwt.sign(userDetails, process.env.JWT_SECRET_KEY);
    return token;
  } catch (error) {
    return error.message;
  }
};

// compare password
userSchema.methods.comparePassword = function (password) {
  // console.log(password, this.password)
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
