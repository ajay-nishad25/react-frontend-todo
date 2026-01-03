import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../redux/actions/authAction";
import "styles/login.css";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    const errors = {
      email: !signUpFormData.email.trim(),
      password: !signUpFormData.password.trim(),
      confirmPassword: !signUpFormData.confirmPassword.trim(),
    };

    setFormError(errors);

    // stop if any field is invalid
    if (errors.email || errors.password || errors.confirmPassword) {
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
