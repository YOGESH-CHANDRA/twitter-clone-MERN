import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTweetContext } from "../context/tweetContext";
import { useAuth } from "../context/authContext";

const CreateTweetModal = () => {
  const { getAllTweets } = useTweetContext();
  const [image, setImage] = useState("");
  const { auth } = useAuth();
  const [content, setContent] = useState("");

  const createTweetRequest = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("image", image);

    try {
      const { data } = await axios.post("api/tweet/createTweet", formData);

      if (data?.error) {
        toast.error(data?.error);
      } else {
        toast.success("Tweet Created Successfully");
        setContent("");
        setImage("");
        getAllTweets();
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              New Tweet
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <textarea
              className="new-tweet"
              onChange={(e) => setContent(e.target.value)}
              name="content"
              // value={}
              cols="60"
              rows="5"
              placeholder="Write something here..."
            />
            <p className="fw-semibold">Uplaod an image for your tweet:</p>
          </div>
          <input
            className="ms-3"
            type="file"
            name="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              data-bs-dismiss="modal"
              onClick={createTweetRequest}
              className="btn btn-primary tweet-btn-2"
            >
              Tweet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTweetModal;
