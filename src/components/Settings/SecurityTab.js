import React from "react";
import { ReactComponent as EyeOpenIcon } from "assets/icons/eye-open.svg";
import { ReactComponent as EyeClosedIcon } from "assets/icons/eye-closed.svg";

export default function SecurityTab({
  resetFormData,
  handleResetInputChange,
  showPassword,
  togglePasswordVisibility,
  resetFormError,
  handleResetPassword,
  isResetLoading,
  resetResponse,
  setResetResponse,
}) {
  return (
    <div className="div-flex-column-h100 div-space-between rg-10 padding-v5">
      <div className="div-flex-column rg-10">
        <span className="content-item-title">
          Change your account password to keep your account secure.
        </span>
        <div className="div-flex-column security-row">
          <label className="content-item-title">Current Password</label>
          <div className="div-flex-column">
            <div className="password-field">
              <input
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                placeholder="Enter current password"
                value={resetFormData.currentPassword}
                onChange={handleResetInputChange}
                className="security-input"
              />
              <span
                className="password-toggle"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPassword.current ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </span>
            </div>
            <div className="error-slot">
              <span
                className={`input-error-message ${
                  resetFormError.currentPassword.status ? "visible" : ""
                }`}
              >
                {resetFormError.currentPassword.message}
              </span>
            </div>
          </div>
        </div>
        <div className="div-flex-column security-row">
          <label className="content-item-title">New Password</label>
          <div className="div-flex-column">
            <div className="password-field">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new password"
                value={resetFormData.newPassword}
                onChange={handleResetInputChange}
                className="security-input"
              />
              <span
                className="password-toggle"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPassword.new ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </span>
            </div>
            <div className="error-slot">
              <span
                className={`input-error-message ${
                  resetFormError.newPassword.status ? "visible" : ""
                }`}
              >
                {resetFormError.newPassword.message}
              </span>
            </div>
          </div>
        </div>
        <div className="div-flex-column security-row">
          <label className="content-item-title">Confirm Password</label>
          <div className="div-flex-column">
            <div className="password-field">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm new password"
                value={resetFormData.confirmPassword}
                onChange={handleResetInputChange}
                className="security-input"
              />
              <span
                className="password-toggle"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPassword.confirm ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </span>
            </div>
            <div className="error-slot">
              <span
                className={`input-error-message ${
                  resetFormError.confirmPassword.status ? "visible" : ""
                }`}
              >
                {resetFormError.confirmPassword.message}
              </span>
            </div>
          </div>
        </div>
        <div className="div-flex-row-w100 div-flex-end padding-v5">
          <button
            className="theme-btn"
            onClick={handleResetPassword}
            disabled={isResetLoading}
          >
            Reset Password
          </button>
        </div>
      </div>

      <div>
        {resetResponse.type && (
          <div
            className={`reset-alert ${
              resetResponse.type === "success"
                ? "reset-alert-success"
                : "reset-alert-error"
            }`}
          >
            <div className="div-flex-row div-align-center cg-10">
              <span className="reset-alert-icon">
                {resetResponse.type === "success" ? "✔" : "⚠"}
              </span>
              <span className="reset-alert-text">{resetResponse.message}</span>
            </div>

            <button
              className="reset-alert-dismiss"
              onClick={() => setResetResponse({ type: null, message: "" })}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
