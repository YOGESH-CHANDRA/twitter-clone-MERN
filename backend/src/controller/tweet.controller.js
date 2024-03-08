const Tweet = require("../model/tweet.model");

const fs = require("fs");
const mongoose = require("mongoose");
const uploadOnCloudinary = require("../utils/cloudinary");

const createTweet = async (req, res) => {
  const { content } = req.body;
  console.log(req.body, req.user.userId, req.file?.path);
  try {
    if (!content) {
      return res.status(400).json("Please Enter something to tweet");
    }
    const imageUrl = (await uploadOnCloudinary(req.file?.path)) || "";
    console.log(imageUrl);
    const createdTweet = await new Tweet({
      content: content,
      tweetedBy: req.user.userId,
      image: imageUrl,
    });
    await createdTweet.save();
    return res.status(201).json({ msg: "Tweet created", tweet: createdTweet });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// This function retrieves all tweets from the database.
const getAllTweets = async (req, res) => {
  console.log("getAllTweets");
  try {
    const tweets = await Tweet.find({})
      .populate("tweetedBy")
      .populate("thisTweetIsRetweetedBy")
      .populate("likes")
      .sort({ createdAt: -1 }); // Sort by latest posts

    return res.status(200).json({ tweets }); // Returning tweets in response
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

/*  deletion of a tweet. 
It receives the tweet ID from the request parameters*/
const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;

    const findThisTweet = await Tweet.find({ _id: id, isAReply: true });

    const tweet = await Tweet.findOne({ _id: id });

    const tweetReplies = await Tweet.findOne({ _id: id })
      .populate("replies.reply")
      .select("replies");
    const tweetReplyIDs = tweetReplies.replies.map((reply) => {
      return reply?.reply?._id;
    });

    const deleteTweetReplies = await Tweet.deleteMany({
      _id: {
        $in: tweetReplyIDs,
      },
    });

    if (tweet.isAReply) {
      const parentTweet = tweet.isAReplyOfTweet.valueOf();
      const updatedTweet = await Tweet.findByIdAndUpdate(
        { _id: tweet.isAReplyOfTweet },
        {
          $pull: {
            replies: {
              reply: tweet._id,
            },
          },
        },
        { new: true }
      );
      const deletedTweet = await Tweet.findByIdAndDelete({ _id: id });
      return res.status(200).json({
        deletedTweet,
        parentTweet,
        deletedReplies: deleteTweetReplies?.deletedCount,
        message: "Tweet Deleted Successfully !",
      });
    } else {
      const deletedTweetNotAReply = await Tweet.findByIdAndDelete({ _id: id });
      return res.status(200).json({
        deletedTweetNotAReply,
        deletedReplies: deleteTweetReplies?.deletedCount,
        message: "Tweet Deleted Successfully !",
      });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const likeDislike = async (req, res) => {
  try {
    const { tweetId } = req.params;
    console.log(tweetId);
    // Checking if the user has already liked the tweet
    const alreadyLiked = await Tweet.findOne({
      "likes.user": req.user.userId,
      _id: tweetId,
    });
    // If the user has already liked the tweet, unliking the tweet by removing the like
    if (alreadyLiked) {
      const unlikeTweet = await Tweet.findOneAndUpdate(
        { _id: alreadyLiked._id },
        {
          $pull: {
            likes: {
              user: req.user.userId,
            },
          },
        },
        {
          new: true,
        }
      );

      return res.status(200).json({ unlikeTweet, like: false });
    }

    // If the user has not already liked the tweet, like the tweet by adding the like
    const likedTweet = await Tweet.findByIdAndUpdate(
      { _id: tweetId },
      {
        $push: {
          likes: { user: req.user.userId },
        },
      }
    );

    res.status(200).json({ likedTweet, like: true });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const followUser = async (req, res) => {};

const reTweet = async (req, res) => {};

/*The getSingleTweet function is used to retrieve a single tweet from a 
database and send it as a response in an API endpoint. */
const getSingleTweet = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json("Please provide an id");
    }
    // Finding the single tweet with the provided 'id'
    const singleTweet = await Tweet.findOne({ _id: id })
      .populate("tweetedBy replies.reply") //retriving replies to the tweet and nested replies
      .select("-password");
    // return error is tweet is not found with the 'id'
    if (!singleTweet) {
      return res.status(404).json("no such tweet found");
    }
    // Sending the singleTweet object in the response
    return res.status(200).send({ singleTweet });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const createComment = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { content, commentedBy } = req.body;
    const tweetToAddACommentOn = await Tweet.findByIdAndUpdate(
      { _id: tweetId },
      {
        $push: {
          comments: {
            content,
            commentedBy,
          },
        },
      },
      { new: true }
    );
    return res.status(200).json({ tweetToAddACommentOn });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

const updateComment = async (req, res) => {
  const { tweetId } = req.params;
  const { content, commentedBy } = req.body;

  try {
    if (!content) {
      return res.status(400).json("Please enter something to reply");
    }
    const commentToAdd = {
      content: content,
      commentedBy: commentedBy,
    };

    const tweetAsComment = await new Tweet({
      content,
      tweetedBy: req.user.userId,
      isAReply: true,
      isAReplyOfTweet: tweetId,
    }).save();

    const tweetToAddACommentOn = await Tweet.findByIdAndUpdate(
      { _id: tweetId },
      {
        $push: {
          comments: [
            {
              comment: tweetAsComment._id,
              content,
              commentedBy: req.user.userId,
            },
          ],
        },
      },
      { new: true }
    );
    const addToReplyArray = await Tweet.findByIdAndUpdate(
      { _id: tweetId },
      {
        $push: {
          replies: { reply: tweetAsComment._id },
        },
      },
      { new: true }
    );
    res.status(200).json({ tweetToAddACommentOn });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getTweetsFromFollowingUsers = async (req, res) => {
  try {
    const followingUsers = req.body.loggedInUser?.following.map(
      (singleTweet) => {
        return singleTweet.user;
      }
    );

    const tweets = await Tweet.find({ tweetedBy: followingUsers }).populate(
      "tweetedBy"
    );

    // Returning the list of tweets as the response
    res.status(200).json({ tweets });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const createReTweet = async (req, res) => {
  const { tweetId } = req.params;
  const tweetedBy = req.user.userId;

  const tweetToRetweet = await Tweet.findOne({ _id: tweetId });
  const retweetsOfTweetToReTweet = tweetToRetweet.reTweetedBy;

  // Adding the current user to the list of users who retweeted the original tweet
  retweetsOfTweetToReTweet.push(tweetedBy);

  // Creating a new tweet as a retweet
  const createNewTweetAsARetweet = await new Tweet({
    isARetweet: true,
    content: tweetToRetweet.content,
    tweetedBy: tweetToRetweet.tweetedBy._id,
    thisTweetIsRetweetedBy: req?.user.userId,
    image: tweetToRetweet?.image ? tweetToRetweet?.image : null,
  }).save();

  // Updating the original tweet's retweet list with the current user
  const retweet = await Tweet.findByIdAndUpdate(
    { _id: tweetId },
    {
      $push: {
        reTweetedBy: [tweetedBy],
      },
    },
    { new: true }
  );

  // Updating the retweet list of the newly created retweet with other users who retweeted the original tweet
  retweet?.reTweetedBy?.map(async (userID) => {
    await Tweet.findByIdAndUpdate(
      { _id: createNewTweetAsARetweet._id.valueOf() },
      {
        $push: {
          reTweetedBy: [userID],
        },
      },
      { new: true }
    );
  });

  res.status(200).json({
    message: "createReTweet",
    tweetId,
    tweetedBy,
    retweet,
    createNewTweetAsARetweet,
  });
};

module.exports = {
  createReTweet,
  getTweetsFromFollowingUsers,
  createTweet,
  updateComment,
  createComment,
  getSingleTweet,
  getAllTweets,
  deleteTweet,
  likeDislike,
  followUser,
  reTweet,
};
