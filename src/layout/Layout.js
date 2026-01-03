import React from "react";
import Navbar from "layout/Navbar";
import { Navigate, Outlet } from "react-router-dom";

export default function Layout() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-main-container">
      <Navbar />
      <Outlet />
    </div>
  );
}
