const User = require("../model/user.model");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {
    const { name, email, username, password, cpassword } = req.body;
    try {
      console.log(req.body);
      if (!name || !email || !username || !password || !cpassword) {
        return res.status(400).json("All fields required" );
      }
      if (password !== cpassword) {
        return res
          .status(400)
          .json("confirm password not matched" );
      }
      const existEmail = await  User.findOne({email});
      const existUserName = await User.findOne({username});
     
      if (existEmail) {
        return res.status(400).json("Email id already exit");
      }
      if (existUserName) {
        return res.status(400).json("Username already exit");
      }
        const newUser = await new User({ name, email, username, password });
        await newUser.save();
        return res.status(201).json("Registraion successful !! ");
      
    } catch (error) {
      return res
        .status(500)
        .json(error.message );
    }
  };
  
const signin = async (req, res) => {
  console.log("test signin")
    try {
      const { username, password } = req.body;
      if (!username) {
        return res.status(400).json("Username not entered" );
      }
      if (!password) {
        return res.status(400).json("Password not entered" );
      }
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json( "User not signup yet" );
      }
      const passwordMatch = await user.comparePassword(password); //password compare
  console.log(user,passwordMatch )
      if (passwordMatch) {
        const token = await user.generateToken(); // function declare in user model
        const { name, username } = user;
        console.log(user,name)
        return res
          .status(200)
          .json({
            user: {
              userId: user._id,
              name: user.name,
              email: user.email,
              profilePic: user.profilePic,
              joiningDate: user.createdAt,
              username: user.username,
              following: user.following,
              followers: user.followers,
              DateOfBirth: user.DateOfBirth || ""
            },
            token,
          });
      } else {
        return res.status(401).json("Email or password not match" );
      }
    } catch (error) {
      console.log(error.message)
      return res
        .status(500)
        .json( error.message );
    }
  };

  module.exports = {
    signup,
    signin
  };