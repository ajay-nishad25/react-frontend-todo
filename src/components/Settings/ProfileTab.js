import React from "react";

export default function ProfileTab({ userName, email }) {
  return (
    <div className="div-flex-column rg-10 padding-v5">
      <span className="content-item-title">
        Manage your personal information associated with your account.
      </span>
      <div className="div-flex-column rg-10">
        <div className="div-flex-row div-space-between div-align-center content-item-row">
          <div className="content-item-text div-flex-column">
            <span className="content-item-title">Username</span>
            <span className="content-item-subtitle">{userName || "—"}</span>
          </div>
        </div>
        <div className="div-flex-row div-space-between div-align-center content-item-row">
          <div className="content-item-text div-flex-column">
            <span className="content-item-title">Email</span>
            <span className="content-item-subtitle">{email || "—"}</span>
          </div>
        </div>
      </div>
      <div className="profile-hint">
        Profile editing will be available soon.
      </div>
    </div>
  );
}
