import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useTweetContext } from "../context/tweetContext";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { auth, setAuth } = useAuth(); /// change auth
  const { authDetails, setAuthDetails } = useTweetContext();

  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    setAuthDetails({ user: null, token: "" });
    localStorage.removeItem("auth");
    toast.info("Logout succesfully");
    return navigate("/login");
  };

  const isAuthenticated = auth?.user;

  if (!isAuthenticated) {
    return navigate("/login");
  }

  return (
    <>
      <div className="col-12 col-sm-3 col-xl-2 px-sm-2 px-0 bg-warning d-flex sticky-top">
        <div className="d-flex flex-sm-column flex-row flex-grow-1 align-items-center align-items-sm-start px-3 pt-2 text-white">
          <NavLink
            to="/"
            className="d-flex align-items-center pb-sm-3 mb-md-0 me-md-auto text-primary text-decoration-none"
          >
            <span className="fs-1">
              <i className="fa-brands fa-twitter"></i>
            </span>
          </NavLink>
          <ul
            className="nav  flex-sm-column flex-row flex-nowrap flex-shrink-1 flex-sm-grow-0 flex-grow-1 mb-sm-auto mb-0 justify-content-center align-items-center align-items-sm-start"
            id="pills-tab"
          >
            <li className="nav-item mb-sm-3 ">
              <NavLink
                to="/"
                className="nav-link px-sm-0 px-2 text-white text-decoration-none"
              >
                <i className="fa-solid fa-house fs-5 mx-3 mx-sm-0"></i>
                <span className="ms-1 d-none d-sm-inline fs-5">Home</span>
              </NavLink>
            </li>
            <li className="nav-item mb-sm-3">
              <NavLink
                to="/profile"
                className="nav-link px-sm-0 px-2 text-white text-decoration-none"
              >
                <i className="fa-solid fa-user fs-5 mx-3 mx-sm-0"></i>
                <span className="ms-1 d-none d-sm-inline fs-5">Profile</span>
              </NavLink>
            </li>
            <li className="nav-item mb-sm-3">
              <NavLink
                onClick={handleLogout}
                className="nav-link px-sm-0 px-2 text-white text-decoration-none"
              >
                <i className="fa-solid fa-right-from-bracket fs-5 mx-3 mx-sm-0"></i>
                <span className="ms-1 d-none d-sm-inline fs-5">Logout</span>
              </NavLink>
            </li>
          </ul>
          <div className="py-sm-4 mt-sm-auto ms-auto ms-sm-0 flex-shrink-1">
            <img
              src={auth?.user?.profilePic}
              alt={`profile`}
              width="28"
              height="28"
              className="rounded-circle"
            />
            <span className="text-primary fw-semibold d-none d-sm-inline mx-2 ">
              @{auth?.user?.username}
            </span>
            <br />
            <span className="text-danger fw-semibold d-none d-sm-inline">
              {auth?.user?.name}
            </span>
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Sidebar;
