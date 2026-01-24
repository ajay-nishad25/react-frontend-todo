import React, { useEffect, useState } from "react";
import "styles/settings.css";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/authAction";
import { useNavigate } from "react-router-dom";
import { ReactComponent as CloseIcon } from "assets/icons/close-icon.svg";
import { ReactComponent as LogoutLogo } from "assets/icons/logout-icon.svg";
import { ReactComponent as ProfileIcon } from "assets/icons/profile-icon.svg";
import { ReactComponent as AppearanceIcon } from "assets/icons/apperance-icon.svg";
import { ReactComponent as SecurityIcon } from "assets/icons/security-icon.svg";
import { getTheme, setTheme } from "utils/theme";

export default function SettingsModal({ isClosing, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setThemeState] = useState(getTheme());

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const { user_name, email } = userData;

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      navigate("/login", { replace: true });
    });
  }

  const tabTitleMap = {
    profile: "Profile",
    appearance: "Appearance",
    security: "Security",
  };

  function handleToggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    setTheme(newTheme);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`settings-modal ${
          isClosing ? "animate-close-create-model" : "animate-open-create-model"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-body">
          <div className="settings-left-panel div-flex-column div-space-between">
            <div className="div-flex-column">
              <div className="settings-header div-flex-row div-align-center div-space-between">
                <span className="settings-main-title">Settings</span>
              </div>

              <div className="div-flex-column settings-menu">
                <div
                  className={`settings-menu-item ${
                    activeTab === "profile" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <div className="div-flex-row div-align-center cg-10">
                    <ProfileIcon />
                    Profile
                  </div>
                </div>

                <div
                  className={`settings-menu-item ${
                    activeTab === "appearance" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("appearance")}
                >
                  <div className="div-flex-row div-align-center cg-10">
                    <AppearanceIcon />
                    Appearance
                  </div>
                </div>

                <div
                  className={`settings-menu-item ${
                    activeTab === "security" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  <div className="div-flex-row div-align-center cg-10">
                    <SecurityIcon />
                    Security
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-logout" onClick={handleLogout}>
              <div className="div-flex-row div-align-center cg-10">
                <LogoutLogo />
                Logout
              </div>
            </div>
          </div>

          <div className="settings-right-panel div-flex-column">
            <div className="settings-tab-header div-flex-row div-align-center div-space-between">
              <span className="settings-main-title">
                {tabTitleMap[activeTab]}
              </span>
              <CloseIcon className="cursor-pointer" onClick={onClose} />
            </div>

            <div className="settings-tab-content">
              {activeTab === "profile" && (
                <div className="div-flex-column rg-10 padding-v5">
                  <span className="content-item-title">
                    Manage your personal information associated with your
                    account.
                  </span>
                  <div className="div-flex-column rg-10">
                    <div className="div-flex-row div-space-between div-align-center content-item-row">
                      <div className="content-item-text div-flex-column">
                        <span className="content-item-title">Username</span>
                        <span className="content-item-subtitle">
                          {user_name || "—"}
                        </span>
                      </div>
                    </div>
                    <div className="div-flex-row div-space-between div-align-center content-item-row">
                      <div className="content-item-text div-flex-column">
                        <span className="content-item-title">Email</span>
                        <span className="content-item-subtitle">
                          {email || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="profile-hint">
                    Profile editing will be available soon.
                  </div>
                </div>
              )}
              {activeTab === "appearance" && (
                <div className="div-flex-column rg-10 padding-v5">
                  <span className="content-item-title">
                    Customize how the application looks on your device.
                  </span>

                  <div className="div-flex-row div-space-between div-align-center content-item-row">
                    <div className="content-item-text div-flex-column">
                      <span className="content-item-title">Theme</span>
                      <span className="content-item-subtitle">
                        Switch between light and dark mode
                      </span>
                    </div>
                    <label className="theme-switch">
                      <input
                        type="checkbox"
                        checked={theme === "dark"}
                        onChange={handleToggleTheme}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                </div>
              )}
              {activeTab === "security" && (
                <div className="div-flex-column rg-10 padding-v5">
                  <span className="content-item-title">
                    Change your account password to keep your account secure.
                  </span>

                  <div className="div-flex-column rg-10">
                    <div className="div-flex-column security-row">
                      <label className="content-item-title">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="security-input"
                      />
                    </div>
                    <div className="div-flex-column security-row">
                      <label className="content-item-title">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="security-input"
                      />
                    </div>
                    <div className="div-flex-column security-row">
                      <label className="content-item-title">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="security-input"
                      />
                    </div>
                    <div className="div-flex-row-w100 div-flex-end padding-v5">
                      <button className="theme-btn">Reset Password</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
