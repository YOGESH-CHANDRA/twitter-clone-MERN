const express = require("express");
const {
  createTweet,
  getAllTweets,
  deleteTweet,
  likeDislike,
  uploadImageToCloud,
  getSingleTweet,
  createComment,
  getTweetsFromFollowingUsers,
 
  createReTweet,
  updateComment,
} = require("../controller/tweet.controller");

const { followUserController } = require("../controller/user.controller");
const { isUserAuthenticated } = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");


const router = express.Router();




// Request to create a new tweet
router.post("/createTweet",upload.single("image"), isUserAuthenticated, createTweet);

// Request to get a single tweet by its ID
router.get("/getSingleTweet/:id", isUserAuthenticated, getSingleTweet);

// Request to get all tweets from the users being followed by the authenticated user
router.post("/getAllTweets", isUserAuthenticated, getTweetsFromFollowingUsers);

// Request to get all tweets
router.get("/getAllTweets", isUserAuthenticated, getAllTweets);
// Request to create a comment on a tweet
router.post("/createComment/:tweetId", isUserAuthenticated, createComment);
router.put("/updateComment/:tweetId", isUserAuthenticated, updateComment);

// Request to create a retweet of a tweet
router.post("/createRetweet/:tweetId", isUserAuthenticated, createReTweet);

// Request to follow a user
router.post(
  "/follow/:follower/:toFollow",
  isUserAuthenticated,
  followUserController
);

// Request to like/Dislike a tweet
router.put("/likeDislike/:tweetId", isUserAuthenticated, likeDislike);

// Request to delete a tweet by its ID
router.delete("/deleteTweet/:id", isUserAuthenticated, deleteTweet);

module.exports = router;
