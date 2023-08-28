import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function LandingPage() {
  return (
    <>
      <div className="container">
        <Sidebar />
        <div className="feature-container">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default LandingPage;
