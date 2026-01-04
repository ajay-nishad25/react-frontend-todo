import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../redux/actions/authAction";
import "styles/login.css";
import { getValidEmailCheck } from "utils/getValidEmailCheck";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signUpFormData, setSignupFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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
    confirmPassword: {
      status: false,
      message: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState({
    status: null,
    message: null,
  });
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

  function handleSignup() {
    // valid email
    const isValidEmail = getValidEmailCheck(signUpFormData.email);

    // valid password
    const isValidPassword = signUpFormData.password.trim().length >= 8;

    // valid confirm password
    const isValidConfirmPasswordLength =
      signUpFormData.confirmPassword.trim().length >= 8;

    // valid confirm password === password
    const isValidConfirmPassword =
      signUpFormData.password.trim() === signUpFormData.confirmPassword.trim();

    const errors = {
      email: {
        status: !signUpFormData.email.trim() || !isValidEmail,
        message: !signUpFormData.email.trim()
          ? "Please enter your email"
          : !isValidEmail
            ? "Please enter a valid email"
            : "",
      },
      password: {
        status: !signUpFormData.password.trim() || !isValidPassword,
        message: !signUpFormData.password.trim()
          ? "Please enter password"
          : !isValidPassword
            ? "Password must be at least 8 characters"
            : "",
      },
      confirmPassword: {
        status:
          !signUpFormData.confirmPassword.trim() ||
          !isValidConfirmPassword ||
          !isValidConfirmPasswordLength,
        message: !signUpFormData.confirmPassword.trim()
          ? "Please confirm your password"
          : !isValidConfirmPasswordLength
            ? "Confirm password must be at least 8 characters"
            : !isValidConfirmPassword
              ? "Confirm password does not match"
              : "",
      },
    };

    setFormError(errors);

    // stop if any field is invalid
    const isAnyFieldInvalid =
      errors.email.status ||
      errors.password.status ||
      errors.confirmPassword.status ||
      !isValidEmail ||
      !isValidPassword ||
      !isValidConfirmPassword ||
      !isValidConfirmPasswordLength;

    if (isAnyFieldInvalid) {
      return;
    }

    setIsLoading(true);
    // setErrorMessage("");
    setShowErrorModal(false);

    const payload = {
      email: signUpFormData.email,
      password: signUpFormData.password,
    };

    dispatch(signUpUser(payload))
      .then((res) => {
        setIsLoading(false);
        setErrorMessage({
          status: 2,
          message: res,
        });
        setShowErrorModal(true);
      })
      .catch((errorMsg) => {
        setIsLoading(false);
        setErrorMessage({
          status: 1,
          message: errorMsg,
        });
        setShowErrorModal(true);
      });
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
    setFormError({
      email: {
        status: false,
        message: "",
      },
      password: {
        status: false,
        message: "",
      },
      confirmPassword: {
        status: false,
        message: "",
      },
    });
    navigate("/login");
  }

  function handleNavigateToLogin() {
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
              value={signUpFormData?.password}
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

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={signUpFormData?.confirmPassword}
              onChange={handleOnChange}
              className={formError.confirmPassword.status ? "input-error" : ""}
            />
            <div className="error-slot">
              <span
                className={`input-error-message ${
                  formError.confirmPassword.status ? "visible" : ""
                }`}
              >
                {formError.confirmPassword.message}
              </span>
            </div>
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
            {errorMessage?.status === 1 ? (
              <span className="error-title">Signup Failed</span>
            ) : (
              <span className="success-title">Signup Success</span>
            )}

            {errorMessage?.status === 1 ? (
              <p className="error-message">{errorMessage?.message}</p>
            ) : (
              <p className="error-message">
                {errorMessage?.message}, Now please login
              </p>
            )}
            {errorMessage?.status === 1 ? (
              <button className="login-button" onClick={handleCloseModal}>
                Close
              </button>
            ) : (
              <button className="login-button" onClick={handleNavigateToLogin}>
                Back to login
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
