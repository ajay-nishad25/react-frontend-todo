import React from "react";
import { useNavigate } from "react-router-dom";
import "styles/not-found.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-description">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <button
          className="not-found-button"
          onClick={() => navigate("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Go Home
        </button>
      </div>
    </div>
  );
}
