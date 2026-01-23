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

export default function SettingsModal({ isOpen, isClosing, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (!isOpen) return null;

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
              <div className="settings-header">
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

          <div className="settings-right-panel">
            <div className="settings-tab-header">
              <span className="settings-main-title">
                {tabTitleMap[activeTab]}
              </span>
              <CloseIcon className="cursor-pointer" onClick={onClose} />
            </div>

            <div className="settings-tab-content">
              {activeTab === "profile" && (
                <div className="">
                  <p className="appearance-title">
                    Manage your personal information associated with your
                    account.
                  </p>
                  <div className="div-flex-column rg-10">
                    <div className="appearance-row">
                      <div className="appearance-text">
                        <span className="appearance-title">Username</span>
                        <span className="appearance-subtitle">
                          {user_name || "—"}
                        </span>
                      </div>
                    </div>
                    <div className="appearance-row">
                      <div className="appearance-text">
                        <span className="appearance-title">Email</span>
                        <span className="appearance-subtitle">
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
                <div className="appearance-section">
                  <p className="appearance-title">
                    Customize how the application looks on your device.
                  </p>

                  <div className="appearance-row">
                    <div className="appearance-text">
                      <span className="appearance-title">Theme</span>
                      <span className="appearance-subtitle">
                        Switch between light and dark mode
                      </span>
                    </div>
                    <label className="theme-switch">
                      <input
                        type="checkbox"
                        checked={theme === "dark"}
                        onChange={() =>
                          setTheme((prev) =>
                            prev === "light" ? "dark" : "light",
                          )
                        }
                      />
                      <span className="slider" />
                    </label>
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
