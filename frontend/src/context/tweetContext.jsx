import axios from "axios";

import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./authContext";
/* Helper function */

const getTweetsFromFollowingUsers = async (loggedInUser) => {
  try {
    const authData = localStorage.getItem("auth");
    const authDataToUse = JSON.parse(authData);

    // Sending a POST request to the server to get all tweets from following users
    const { data } = await axios.post(
      `api/tweet/getAllTweets`,
      { loggedInUser },
      {
        headers: {
          Authorization: `Bearer ${authDataToUse?.token}`,
        },
      }
    );
    // Returning the response data (tweets from following users)
    return data;
  } catch (error) {
    console.log(error);
  }
};

/* Helper function */
// Function to get details of the logged-in user
const getLoggedInUser = async () => {
  try {
    console.log("attempt");
    const authData = localStorage.getItem("auth");
    const authDataToUse = JSON.parse(authData);
    const { data } = await axios.get(`api/user/getLoggedInUserDetails`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const TweetContext = createContext();

const TweetProvider = ({ children }) => {
  const navigate = useNavigate();
  const [allTweets, setAllTweets] = useState([]);
  const { auth, setAuth } = useAuth();
  // to store the tweets & replies from the single user page
  const [singleUserPageDetails, setSingleUserPageDetails] = useState();
  const [tweetsFromFollowingUsers, setTweetsFromFollowingUsers] = useState([]);
  const [authDetails, setAuthDetails] = useState();

  const [tweetBool, setTweetBool] = useState(false);
  const [tweetToAddACommentOn, setTweetToAddACommentOn] = useState(null);

  // This function is used to send a request to like/dislike a tweet.
  const likeRequest = async (tweetToLike) => {
    const { data } = await axios.put(`api/tweet/likeTweet/${tweetToLike}`);
    if (data?.error) {
      toast.error(data?.error);
    } else {
      if (data?.like) {
        toast.info("Tweet Liked Successfully");
      }
      // Since we are sending boolean value in backend, this will work like toggle
      if (!data?.like) {
        toast.info("Tweet Unliked Successfully");
      }
      // Calling these two to update the user details and all tweets after liking/disliking a tweet.
      getSingleUserDetails();
      getAllTweets();
    }
  };

  // This function is used to send a delete request to backend
  const deleteRequest = async (id) => {
    const { data } = await axios.delete(`api/tweet/deleteTweet/${id}`);

    if (data?.error) {
      toast.error(data?.error);
    } else {
      if (data?.deletedReplies) {
        toast.success(
          `Tweet deleted successfully along with ${data?.deletedReplies} nested reply(ies)`
        );
      }
      toast.success("Tweet Deleted Successfully");
      // updating
      getAllTweets();
    }
  };

  const showSingleTweet = (id) => {
    navigate(`/tweet/${id}`);
  };

  // This function will fetch details of a tweet to be commented on.
  const fetchDetailsOfTweetToCommentOn = async (IDOftweetToCommentOn) => {
    setTweetToAddACommentOn(IDOftweetToCommentOn);
    const { data } = await axios.get(
      `api/tweet/getSingleTweet/${IDOftweetToCommentOn}`
      // console.log(data);
    );
  };

  // sending a request to retweet a tweet.
  const retweetRequest = async (id) => {
    const { data } = await axios.post(`api/tweet/createReTweet/${id}`);
    // console.log(data);
    if (data?.error) {
      toast.error(data?.error);
    } else {
      toast.success("retweeted Successfully");

      navigate("/");
    }

    // Updating
    getAllTweets();
  };

  async function getLoggedInDetails() {
    const loggedInUser = await getLoggedInUser();
    // console.log(loggedInUser);
    const following = await getTweetsFromFollowingUsers(loggedInUser);

    // console.log(following);
    setTweetsFromFollowingUsers(following?.tweets);

    return loggedInUser;
  }

  // Sending a GET request to getch the details of sinle user
  const getSingleUserDetails = async () => {
    const { data } = await axios.get(`api/user/getSingleUser`);
    if (data?.error) {
      toast?.error(data?.error);
    } else {
      setSingleUserPageDetails(data);
    }
  };

  if (!singleUserPageDetails) {
    getSingleUserDetails();
  }
  if (!tweetsFromFollowingUsers) {
    getLoggedInDetails();
  }

  // This function will fetch all tweets to show on the feed
  const getAllTweets = async () => {
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        var authDataToUse = JSON.parse(authData);
        const { data } = await axios.get("api/tweet/getAllTweets", {
          headers: {
            Authorization: `Bearer ${authDataToUse?.token}`,
          },
        });
        if (data?.tweets) {
          setAllTweets(data?.tweets);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (tweetsFromFollowingUsers) {
    // console.log(tweetsFromFollowingUsers);
  }
  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const parsed = JSON.parse(authData);
      setAuthDetails({
        ...authDetails,
        user: parsed.user,
        token: parsed.token,
      });
    }
    getAllTweets();
    getLoggedInDetails();
  }, []);

  return (
    <TweetContext.Provider
      value={{
        showSingleTweet,
        deleteRequest,
        retweetRequest,
        fetchDetailsOfTweetToCommentOn,
        getSingleUserDetails,
        likeRequest,
        auth,
        tweetToAddACommentOn,
        setAuthDetails,
        setTweetToAddACommentOn,
        tweetBool,
        setTweetBool,
        tweetsFromFollowingUsers,
        allTweets,
        getAllTweets,
        authDetails,
        setAuthDetails,
        singleUserPageDetails,
        getLoggedInUser,
      }}
    >
      {children}
    </TweetContext.Provider>
  );
};

const useTweetContext = () => useContext(TweetContext);

export { useTweetContext, TweetProvider };
