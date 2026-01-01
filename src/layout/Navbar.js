import React from "react";
import "styles/navbar.css";
import userProfileImage from "assets/images/user-profile-icon.png";

export default function Navbar() {
  return (
    <div className="navbar-container">
      <div className="navbar-inner-container">
        <span>Tasks</span>
        <img src={userProfileImage} className="navbar-profile" alt="" />
      </div>
    </div>
  );
}
