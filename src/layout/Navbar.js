import React, { useEffect, useRef, useState } from "react";
import "styles/navbar.css";
import { useSelector } from "react-redux";
import { ReactComponent as TaskLogo } from "assets/icons/task-logo.svg";
import { ReactComponent as UserProfileImage } from "assets/icons/user-profile-icon.svg";
import SettingsModal from "components/Settings/SettingsModal";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const [openSettingModel, setOpenSettingModel] = useState(false);
  const [isSettingClosing, setIsSettingClosing] = useState(false);

  const authReducer = useSelector((state) => state.authReducer);
  const { userLoggedInData } = authReducer;
  const userName = userLoggedInData?.userData?.user_name;

  function handleToggleMenu() {
    setOpenMenu((prev) => !prev);
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

  function handleSettingModelToggle() {
    setIsSettingClosing(false);
    setOpenSettingModel(true);
    setOpenMenu(false); // close dropdown when opening modal
  }

  function handleCloseSettingModal() {
    setIsSettingClosing(true);
    setTimeout(() => {
      setOpenSettingModel(false);
      setIsSettingClosing(false);
    }, 250); // must match your CSS animation duration
  }

  // close modal on ESCAPE button press
  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === "Escape") {
        if (openSettingModel) handleCloseSettingModal();
      }
    }
    window.addEventListener("keydown", handleEscClose);
    return () => {
      window.removeEventListener("keydown", handleEscClose);
    };
  }, [openSettingModel]);

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-inner-container">
          <div className="div-flex-row div-align-center">
            <TaskLogo />
          </div>

          <div className="profile-wrapper" ref={menuRef}>
            <UserProfileImage
              className="navbar-profile"
              onClick={handleToggleMenu}
            />

            {openMenu && (
              <div className="profile-menu">
                <div className="profile-menu-item">Hi, {userName}</div>
                <div
                  className="profile-menu-item"
                  onClick={handleSettingModelToggle}
                >
                  Setting
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* SETTINGS MODAL */}
      {openSettingModel && (
        <SettingsModal
          isClosing={isSettingClosing}
          onClose={handleCloseSettingModal}
        />
      )}
    </>
  );
}
