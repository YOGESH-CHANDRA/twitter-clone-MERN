import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const WrapperLayout = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

export default WrapperLayout;
