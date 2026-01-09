import React, { useEffect, useRef, useState } from "react";
import "styles/navbar.css";
import userProfileImage from "assets/images/user-profile-icon.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/actions/authAction";
import { ReactComponent as TaskLogo } from "assets/icons/task-logo.svg";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function handleToggleMenu() {
    setOpenMenu((prev) => !prev);
  }

  function handleLogout() {
    setOpenMenu(false);
    dispatch(logoutUser()).then(() => {
      navigate("/login", { replace: true });
    });
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar-container">
      <div className="navbar-inner-container">
        <div className="div-flex-row div-align-center">
          <TaskLogo />
        </div>

        <div className="profile-wrapper" ref={menuRef}>
          <img
            src={userProfileImage}
            className="navbar-profile"
            alt="User profile"
            onClick={handleToggleMenu}
          />

          {openMenu && (
            <div className="profile-menu">
              <div className="profile-menu-item theme-toggle">
                <span>Theme</span>

                <label className="theme-switch">
                  <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={() =>
                      setTheme((prev) => (prev === "light" ? "dark" : "light"))
                    }
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="profile-menu-item logout" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
