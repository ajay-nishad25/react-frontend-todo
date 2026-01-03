import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/login.css";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/actions/authAction";
import { getValidEmailCheck } from "utils/getValidEmailCheck";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState({
    email: {
      status: false,
      message: "",
    },
    password: {
      status: false,
      message: "",
    },
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
      [name]: {
        status: false,
        message: "",
      },
    }));
  }

  function handleLogin() {
    // valid email
    const isValidEmail = getValidEmailCheck(loginFormData.email);

    // valid password
    const isValidPassword = loginFormData.password.trim().length >= 8;

    const errors = {
      email: {
        status: !loginFormData.email.trim() || !isValidEmail,
        message: !loginFormData.email.trim()
          ? "Please enter your email"
          : !isValidEmail
            ? "Please enter a valid email"
            : "",
      },
      password: {
        status: !loginFormData.password.trim() || !isValidPassword,
        message: !loginFormData.password.trim()
          ? "Please enter your password"
          : !isValidPassword
            ? "Password must be at least 8 characters"
            : "",
      },
    };

    setFormError(errors);

    // stop if any field is invalid

    const isAnyFieldInvalid =
      errors.email?.status ||
      errors.password?.status ||
      !isValidEmail ||
      !isValidPassword;

    if (isAnyFieldInvalid) {
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
              className={formError.email.status ? "input-error" : ""}
            />
            <div className="error-slot">
              <span
                className={`input-error-message ${
                  formError.email.status ? "visible" : ""
                }`}
              >
                {formError.email.message}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={loginFormData?.password}
              onChange={handleOnChange}
              className={formError.password.status ? "input-error" : ""}
            />
            <div className="error-slot">
              <span
                className={`input-error-message ${
                  formError.password.status ? "visible" : ""
                }`}
              >
                {formError.password.message}
              </span>
            </div>
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
