import React, { useEffect, useState } from "react";
import "styles/settings.css";
import { useDispatch } from "react-redux";
import { logoutUser, resetPassword, updateUserTheme } from "../../redux/actions/authAction";
import { useNavigate } from "react-router-dom";
import { ReactComponent as CloseIcon } from "assets/icons/close-icon.svg";
import { ReactComponent as LogoutLogo } from "assets/icons/logout-icon.svg";
import { ReactComponent as ProfileIcon } from "assets/icons/profile-icon.svg";
import { ReactComponent as AppearanceIcon } from "assets/icons/apperance-icon.svg";
import { ReactComponent as SecurityIcon } from "assets/icons/security-icon.svg";
import { getTheme, setTheme } from "utils/theme";
import ProfileTab from "./ProfileTab";
import AppearanceTab from "./AppearanceTab";
import SecurityTab from "./SecurityTab";

export default function SettingsModal({ isClosing, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setThemeState] = useState(getTheme());

  const [resetFormData, setResetFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [resetFormError, setResetFormError] = useState({
    currentPassword: { status: false, message: "" },
    newPassword: { status: false, message: "" },
    confirmPassword: { status: false, message: "" },
  });

  const [resetResponse, setResetResponse] = useState({
    type: null,
    message: "",
  });
  
  const [themeResponse, setThemeResponse] = useState({
    type: null,
    message: "",
  });

  const [isResetLoading, setIsResetLoading] = useState(false);
  const [isThemeLoading, setIsThemeLoading] = useState(false);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  function togglePasswordVisibility(field) {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }

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
    
    setIsThemeLoading(true);
    setThemeResponse({ type: null, message: "" });
    
    // Update theme in backend
    dispatch(updateUserTheme(newTheme))
      .then((res) => {
        setThemeResponse({
          type: "success",
          message: res || "Theme updated successfully",
        });
      })
      .catch((err) => {
        setThemeResponse({
          type: "error",
          message: err || "Failed to update theme",
        });
      })
      .finally(() => {
        setIsThemeLoading(false);
      });
  }

  function handleResetInputChange(e) {
    const { name, value } = e.target;

    setResetFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setResetFormError((prev) => ({
      ...prev,
      [name]: { status: false, message: "" },
    }));
  }

  function handleTabToogle(tab) {
    if (tab !== "security") {
      setShowPassword({
        current: false,
        new: false,
        confirm: false,
      });
      setResetFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setResetFormError({
        currentPassword: { status: false, message: "" },
        newPassword: { status: false, message: "" },
        confirmPassword: { status: false, message: "" },
      });
      setResetResponse({
        type: null,
        message: "",
      });
    }
    if (tab !== "appearance") {
      setThemeResponse({
        type: null,
        message: "",
      });
    }
    setActiveTab(tab);
  }

  function handleResetPassword() {
    setResetResponse({
      type: null,
      message: "",
    });

    const { currentPassword, newPassword, confirmPassword } = resetFormData;

    const isValidNewLength = newPassword.trim().length >= 8;
    const isValidConfirmLength = confirmPassword.trim().length >= 8;
    const isMatch = newPassword.trim() === confirmPassword.trim();
    const isDifferentFromCurrent =
      currentPassword.trim() !== newPassword.trim();

    const errors = {
      currentPassword: {
        status: !currentPassword.trim(),
        message: !currentPassword.trim() ? "Please enter current password" : "",
      },
      newPassword: {
        status:
          !newPassword.trim() || !isValidNewLength || !isDifferentFromCurrent,
        message: !newPassword.trim()
          ? "Please enter new password"
          : !isValidNewLength
            ? "Password must be at least 8 characters"
            : !isDifferentFromCurrent
              ? "New password must be different from current password"
              : "",
      },
      confirmPassword: {
        status: !confirmPassword.trim() || !isValidConfirmLength || !isMatch,
        message: !confirmPassword.trim()
          ? "Please confirm your password"
          : !isValidConfirmLength
            ? "Confirm password must be at least 8 characters"
            : !isMatch
              ? "Confirm password does not match"
              : "",
      },
    };

    setResetFormError(errors);

    const isAnyInvalid =
      errors.currentPassword.status ||
      errors.newPassword.status ||
      errors.confirmPassword.status;

    if (isAnyInvalid) return;

    const resetPasswordPayload = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    setIsResetLoading(true);

    dispatch(resetPassword(resetPasswordPayload))
      .then((res) => {
        setResetResponse({
          type: "success",
          message: res || "Password reset successfully",
        });
        setResetFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPassword({
          current: false,
          new: false,
          confirm: false,
        });
      })
      .catch((err) => {
        setResetResponse({
          type: "error",
          message: err || "Failed to reset password. Please try again.",
        });
      })
      .finally(() => {
        setIsResetLoading(false);
      });
  }

  // auto dismiss alter msg
  useEffect(() => {
    if (!resetResponse.type) return;
    const timer = setTimeout(() => {
      setResetResponse({ type: null, message: "" });
    }, 5000);
    return () => clearTimeout(timer);
  }, [resetResponse.type]);
  
  // auto dismiss theme change alter msg
  useEffect(() => {
    if (!themeResponse.type) return;
    const timer = setTimeout(() => {
      setThemeResponse({ type: null, message: "" });
    }, 5000);
    return () => clearTimeout(timer);
  }, [themeResponse.type]);

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
                  onClick={() => handleTabToogle("profile")}
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
                  onClick={() => handleTabToogle("appearance")}
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
                  onClick={() => handleTabToogle("security")}
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
              {activeTab === "profile" && <ProfileTab userName={user_name} email={email} />}
              {activeTab === "appearance" && (
                <AppearanceTab
                  theme={theme}
                  handleToggleTheme={handleToggleTheme}
                  isThemeLoading={isThemeLoading}
                  themeResponse={themeResponse}
                  setThemeResponse={setThemeResponse}
                />
              )}
              {activeTab === "security" && (
                <SecurityTab
                  resetFormData={resetFormData}
                  handleResetInputChange={handleResetInputChange}
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                  resetFormError={resetFormError}
                  handleResetPassword={handleResetPassword}
                  isResetLoading={isResetLoading}
                  resetResponse={resetResponse}
                  setResetResponse={setResetResponse}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
