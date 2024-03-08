import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";

import { useTweetContext } from "../context/tweetContext";

const EditProfileModal = () => {
  const [image, setImage] = useState("");
  const { auth, setAuth } = useAuth();
  const { getLoggedInUser } = useTweetContext();

  const pfpUploadHandler = async (e) => {
    e.preventDefault();
    console.log(image);
    if (!image) {
      return toast.error("Please upload a file");
    }
    try {
      const formData = new FormData();
      formData.append("image", image);
      console.log(formData);
      console.log(image);
      const { data } = await axios.patch(
        "api/user/uploadProfilePicture",
        formData
      );
      console.log(data);

      if (data?.error) {
        toast.error(data?.error);
      } else {
        toast.success("Image upload succefully");
        const resp = await getLoggedInUser();

        const data = {
          user: resp,
          token: auth.token,
        };
        console.log(data);

        localStorage.set("auth", JSON.stringify(data));
        console.log(auth);
        setAuth(data);
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="exampleModal3"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Upload Profile Picture
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-center flex-column">
              <div>
                <span className="fw-bold fs-5 me-2">Click here:</span>
                <label htmlFor="inputField" className="btn"></label>
                <input
                  type="file"
                  name="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  // style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="mt-2"></div>
            {/* {file?.preview && (
              <img
                src={file?.preview}
                alt=""
                className="img-fluid"
                height="150"
                width="150"
              />
            )} */}
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
                onClick={pfpUploadHandler}
                className="btn btn-primary"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
