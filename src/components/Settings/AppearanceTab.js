import React from "react";

export default function AppearanceTab({
  theme,
  handleToggleTheme,
  isThemeLoading,
  themeResponse,
  setThemeResponse,
  pageOptions,
  pageSize,
  handlePageSizeChange,
}) {
  return (
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
        <div className="div-flex-row">
          <label className="theme-switch">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={handleToggleTheme}
              disabled={isThemeLoading}
            />
            <span className="slider" />
          </label>
        </div>
      </div>

      <div className="div-flex-row div-space-between div-align-center content-item-row">
        <div className="content-item-text div-flex-column">
          <span className="content-item-title">Items per page</span>
          <span className="content-item-subtitle">
            Set the number of records displayed per page
          </span>
          <div className="div-flex-row items-per-page-options">
            {pageOptions.map((option) => (
              <label key={option} className="radio-option">
                <input
                  type="radio"
                  name="pageSize"
                  value={option}
                  checked={pageSize === option}
                  onChange={() => handlePageSizeChange(option)}
                />
                <span className="custom-radio" />
                <span className="radio-label">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        {themeResponse.type && (
          <div
            className={`reset-alert ${
              themeResponse.type === "success"
                ? "reset-alert-success"
                : "reset-alert-error"
            }`}
          >
            <div className="div-flex-row div-align-center cg-10">
              <span className="reset-alert-icon">
                {themeResponse.type === "success" ? "✔" : "⚠"}
              </span>
              <span className="reset-alert-text">{themeResponse.message}</span>
            </div>

            <button
              className="reset-alert-dismiss"
              onClick={() => setThemeResponse({ type: null, message: "" })}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
