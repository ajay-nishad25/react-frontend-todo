import React from "react";
import Navbar from "layout/Navbar";
import { Navigate, Outlet } from "react-router-dom";

export default function Layout() {
  const token = false;
  if (token === false) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-main-container">
      <Navbar />
      <Outlet />
    </div>
  );
}
