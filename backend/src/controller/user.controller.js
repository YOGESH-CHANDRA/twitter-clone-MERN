const Tweet = require("../model/tweet.model");
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const uploadOnCloudinary = require("../utils/cloudinary");

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const tweetsByThisUser = await Tweet.find({ tweetedBy: id });

    const user = await User.findOne({ _id: id }).select("-password").sort({ createdAt: -1 });

    return res.status(200).json({ user, tweetsByThisUser });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getSingleUserDirectly = async (req, res) => {
try {
    const user = await User.findOne({ _id: req.user.userId }).select("-password");
  
    // Finding the tweets by the logged-in user, populate the 'tweetedBy' field
    const tweets = await Tweet.find({ tweetedBy: req.user.userId })
      .populate("tweetedBy")
      .sort({ createdAt: -1 }); //sorting them by the latest posts
  
    const allReplies = await Tweet.find({
      isAReply: true,
      tweetedBy: req.user.userId,
    });
  
    res.json({ user, allReplies, tweets });
} catch (error) {
  return res.status(500).json(error.message)
}
};

const followUserController = async (req, res) => {
  const { follower, toFollow } = req.params;
  // const { follower, toFollow } = req.query;

  const alreadyFollowed = await User.findOne({
    "followers.user": follower,
    _id: toFollow,
  });

  if (alreadyFollowed) {
    const userToUnfollow = await User.findOneAndUpdate(
      { _id: toFollow },
      {
        $pull: {
          followers: {
            user: req.user.userId,
          }
        }
      },
      { new: true }
    );

    const userToRemoveFromFollowingArray = await User.findOneAndUpdate(
      { _id: req.user.userId },
      {
        $pull: {
          following: {
            user:toFollow
          }
        }
      },
      { new: true }
    );

    // Returning the updated user details
    return res
      .status(200)
      .json({ userToUnfollow, userToRemoveFromFollowingArray });
  }

  // If not already followed, follow the user by adding their references to 'followers' and 'following' arrays
  const userToFollow = await User.findOneAndUpdate(
    { _id: toFollow },
    {
      $push: {
        followers: {
          user: req.user.userId,
        },
      },
    },
    { new: true }
  );

  // console.log(req.user);
  const userWhoFollowed = await User.findOneAndUpdate(
    { _id: req.user.userId },
    {
      $push: {
        following: {
          user: toFollow
        },
      },
    },
    { new: true }
  );

  res.status(200).json({ userToFollow, userWhoFollowed });
};

const getLoggedInUserDetails = async (req, res) => {
 try {
   const _id = req.user.userId;
   console.log(_id)
   const loggedInUser = await User.findOne({ _id }).select("-password");
   res.status(200).json(loggedInUser);
 } catch (error) {
  return res.status(500).json(error.message)
 }
};



// Function to upload an image to cloudinary
const uploadProfilePicture = async (req, res) => {
  try {
    console.log("pics upload")
    console.log(req.file?.path);
      // const localPath = req.file.path;
      const imageUrl = await uploadOnCloudinary(req.file?.path) || "";
      console.log(imageUrl)
      const updateProfilePicture = await User.findByIdAndUpdate(
        { _id: req.user.userId },
        {
          profilePic: imageUrl
        },
        {new: true}
      );
      console.log(updateProfilePicture)
      return res.status(200).json("Profile pics update succesfully");
    }
     catch (error) {
      return res.status(500).json(error.message)
    }
};

// Function to update user profile details, name, location and dob
const updateUserProfileDetails = async (req, res) => {
  const _id = req.user.userId;
  console.log("update", req.body);
  const { name, location, date_of_birth } = req.body;
  if (!name || !location || !date_of_birth) {
    return res.status(404).json("please enter all the fields");
  }
  try {
    // Checking if the user to be updated already exists
    const userAlreadyExists = await User.findOne({ _id }).select("-password");

    if (!userAlreadyExists) {
      return res.status(404).json("user does not exist");
    }

    // Updating the user profile details and return the updated user details along with the token
    const editedUser = await User.findByIdAndUpdate(
      { _id },
      {
        name: name,
        location: location,
        DateOfBirth: date_of_birth,
      },
      { new: true }
    );
    console.log("editedUser", editedUser)
    res.status(200).json({
      user: {
        userId: userAlreadyExists._id,
        name: editedUser?.name || userAlreadyExists.name,
        email: userAlreadyExists.email,

        DateOfBirth: editedUser?.DateOfBirth || userAlreadyExists.DateOfBirth,
        location: editedUser?.location || userAlreadyExists.location,
        username: userAlreadyExists.username,
        following: userAlreadyExists.following,
        followers: userAlreadyExists.followers,
        joiningDate: userAlreadyExists.createdAt,
        profilePic:userAlreadyExists.profilePic
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

module.exports = {
  updateUserProfileDetails,
  getSingleUserDirectly,
  getSingleUser,
  followUserController,
  getLoggedInUserDetails,
  uploadProfilePicture,
  
};
