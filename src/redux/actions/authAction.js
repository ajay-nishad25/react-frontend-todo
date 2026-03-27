import { LOGIN, LOGOUT, RESET_PASSWORD, SIGNUP } from "../types";
import {
  loginApi,
  signUpApi,
  logoutApi,
  resetPasswordApi,
  updateThemeApi,
} from "api/authApi.js";

export const loginUser = (payload) => (dispatch) => {
  return loginApi(payload)
    .then((data) => {
      dispatch({
        type: LOGIN,
        payload: data,
      });
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const signUpUser = (payload) => (dispatch) => {
  return signUpApi(payload)
    .then((data) => {
      dispatch({
        type: SIGNUP,
        payload: data,
      });
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const logoutUser = () => (dispatch) => {
  return logoutApi()
    .then((data) => {
      dispatch({
        type: LOGOUT,
        payload: data,
      });
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const resetPassword = (resetPasswordPayload) => (dispatch) => {
  return resetPasswordApi(resetPasswordPayload)
    .then((data) => {
      dispatch({
        type: RESET_PASSWORD,
        payload: data,
      });
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const updateUserTheme = (themeValue) => (dispatch) => {
  return updateThemeApi(themeValue)
    .then((data) => {
      // Update userData in localStorage to keep in sync
      const userDataStr = localStorage.getItem("userData");
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          userData.theme = themeValue === "dark" ? 2 : 1;
          localStorage.setItem("userData", JSON.stringify(userData));
        } catch (e) {
          // ignore this block
        }
      }
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
