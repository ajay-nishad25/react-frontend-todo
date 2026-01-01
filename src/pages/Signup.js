import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/login.css";

export default function Signup() {
  const navigate = useNavigate();

  const [signUpFormData, setSignupFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  function handleOnChange(e) {
    const { name, value } = e.target;
    setSignupFormData({
      ...signUpFormData,
      [name]: value,
    });

    // clear error for this field
    setFormError((prev) => ({
      ...prev,
      [name]: false,
    }));
  }

  console.log("formError", formError);

  function handleSignup() {
    const errors = {
      email: !signUpFormData.email.trim(),
      password: !signUpFormData.password.trim(),
      confirmPassword: !signUpFormData.confirmPassword.trim(),
    };

    setFormError(errors);

    // stop if any field is invalid
    if (errors.email || errors.password) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setShowErrorModal(false);

    console.log("Login data:", signUpFormData);

    // simulate login API
    setTimeout(() => {
      setIsLoading(false);
      // assume error from API
      setErrorMessage("Account does not exist");
      setShowErrorModal(true);
    }, 1000);
  }

  function handleCloseModal() {
    setShowErrorModal(false);
  }

  function handleMoveToSignup() {
    if (isLoading) return;
    setSignupFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
    navigate("/login");
  }

  return (
    <>
      <div className="login-main-container">
        <div className="login-card">
          <h2 className="login-title">Sign up</h2>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={signUpFormData?.email}
              onChange={handleOnChange}
              className={formError.email ? "input-error" : ""}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={signUpFormData?.password}
              onChange={handleOnChange}
              className={formError.password ? "input-error" : ""}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={signUpFormData?.confirmPassword}
              onChange={handleOnChange}
              className={formError.confirmPassword ? "input-error" : ""}
            />
          </div>

          <button className="login-button" onClick={handleSignup}>
            {isLoading ? <span className="button-loader" /> : "Sign up"}
          </button>

          <p className="signup-text">
            Already have an account?{" "}
            <span onClick={handleMoveToSignup}>Log in</span>
          </p>
        </div>
      </div>
      {showErrorModal && (
        <div className="modal-backdrop">
          <div className="error-modal ios-modal">
            <span className="error-title">Login Failed</span>
            <p className="error-message">{errorMessage}</p>
            <button className="login-button" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
