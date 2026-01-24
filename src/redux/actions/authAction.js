import { LOGIN, LOGOUT, RESET_PASSWORD, SIGNUP } from "../types";
import {
  loginApi,
  signUpApi,
  logoutApi,
  resetPasswordApi,
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
