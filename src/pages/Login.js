import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/login.css";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/actions/authAction";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState({
    email: false,
    password: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  function handleOnChange(e) {
    const { name, value } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
    // clear error for this field
    setFormError((prev) => ({
      ...prev,
      [name]: false,
    }));
  }

  function handleLogin() {
    const errors = {
      email: !loginFormData.email.trim(),
      password: !loginFormData.password.trim(),
    };

    setFormError(errors);

    // stop if any field is invalid
    if (errors.email || errors.password) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setShowErrorModal(false);

    dispatch(loginUser(loginFormData))
      .then(() => {
        setIsLoading(false);
        navigate("/", { replace: true });
      })
      .catch((errorMsg) => {
        setIsLoading(false);
        setErrorMessage(errorMsg);
        setShowErrorModal(true);
      });
  }

  function handleCloseModal() {
    setShowErrorModal(false);
  }

  function handleMoveToLogin() {
    if (isLoading) return;
    setLoginFormData({
      email: "",
      password: "",
    });
    navigate("/signup");
  }

  return (
    <>
      <div className="login-main-container">
        <div className="login-card">
          <h2 className="login-title">Log in</h2>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={loginFormData?.email}
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
              value={loginFormData?.password}
              onChange={handleOnChange}
              className={formError.password ? "input-error" : ""}
            />
          </div>

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <span className="button-loader" /> : "Log in"}
          </button>

          <p className="signup-text">
            Don't have an account?{" "}
            <span onClick={handleMoveToLogin}>Sign up</span>
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
