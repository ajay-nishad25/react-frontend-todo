import React, { useState } from "react";
import "styles/settings.css";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/authAction";
import { useNavigate } from "react-router-dom";

export default function SettingsModal({
  isOpen,
  isClosing,
  onClose,
  theme,
  setTheme,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  if (!isOpen) return null;

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      navigate("/login", { replace: true });
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`settings-modal ${
          isClosing ? "animate-close-create-model" : "animate-open-create-model"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="settings-header">
          <span className="settings-title">Settings</span>
        </div>

        {/* BODY */}
        <div className="settings-body">
          {/* LEFT SIDEBAR */}
          <div className="settings-sidebar">
            <button
              className={`settings-tab ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>

            <button
              className={`settings-tab ${
                activeTab === "theme" ? "active" : ""
              }`}
              onClick={() => setActiveTab("theme")}
            >
              Theme
            </button>

            <button
              className={`settings-tab ${
                activeTab === "security" ? "active" : ""
              }`}
              onClick={() => setActiveTab("security")}
            >
              Security
            </button>

            <button className="settings-tab danger" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* RIGHT CONTENT */}
          <div className="settings-content">
            {activeTab === "profile" && (
              <>
                <h3 className="settings-section-title">Profile</h3>
                <p className="settings-hint">
                  Profile editing will be available soon.
                </p>
              </>
            )}

            {activeTab === "theme" && (
              <>
                <h3 className="settings-section-title">Theme</h3>

                <div className="settings-row">
                  <span>Dark Mode</span>
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
              </>
            )}

            {activeTab === "security" && (
              <>
                <h3 className="settings-section-title">Security</h3>

                <button className="primary-btn">Reset Password</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
