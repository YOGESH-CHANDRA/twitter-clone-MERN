import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/authContext";
import { useTweetContext } from "../context/tweetContext";

const loginObject = {
  username: "",
  password: "",
};
const Login = () => {
  const [loginDetails, setLoginDetails] = useState(loginObject);

  const { auth, setAuth } = useAuth();

  const navigate = useNavigate();

  const { getAllTweets } = useTweetContext();

  const onChange = (e) => {
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
  };

  const loginRequest = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/auth/signin", loginDetails);
      if (data?.error) {
        toast.error(data?.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        console.log(data);
        setAuth({
          token: data?.token,
          user: data?.user,
        });
        console.log(data);
        console.log(data.user.profilePic);
        getAllTweets();
        toast.success("User Logged In Successfully");

        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <section className="vh-100 vw-100 bg-primary-subtle">
      <div className="container-fluid h-custom pt-5">
        <ToastContainer />
        <h2 className="text-center">Login To Your Account</h2>
        <div className="row d-flex justify-content-center align-items-center h-100 py-md-5">
          <div className="col-md-9 col-lg-5 col-xl-5">
            <img
              src="https://cdn.siasat.com/wp-content/uploads/2023/07/twitter-logo.jpg"
              className="img-fluid"
              alt="Sample"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 ">
            <form className="text-start">
              {/* <!-- Email input --> */}
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form3Example3">
                  Username
                </label>
                <input
                  type="text"
                  id="form3Example3"
                  className="form-control form-control-lg shadow-none "
                  placeholder="Enter your username"
                  name="username"
                  onChange={onChange}
                  required
                />
              </div>

              {/* <!-- Password input --> */}
              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="form3Example4">
                  Password
                </label>
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg shadow-none"
                  placeholder="Enter password"
                  name="password"
                  onChange={onChange}
                  required
                />
              </div>

              <div className="d-grid text-center text-lg-start">
                <button
                  className="btn btn-primary btn-lg"
                  type="submit"
                  onClick={(event) => loginRequest(event)}
                >
                  Login
                </button>
                <p className="fw-semibold mt-2 pt-1 mb-0">
                  Don't have an account?{" "}
                  <Link to="/register" className="link-primary">
                    Register Here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
