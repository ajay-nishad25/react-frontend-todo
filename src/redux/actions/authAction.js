import { LOGIN, LOGOUT, SIGNUP } from "../types";
import { loginApi, signUpApi, logoutApi } from "api/authApi.js";

// export const loginUser = (payload) => (dispatch) => {
//   loginApi(payload).then((data) => {
//     console.log("data", data);
//     dispatch({
//       type: LOGIN,
//       payload: data,
//     });
//     return Promise.resolve(data);
//   });
// };

export const loginUser = (payload) => (dispatch) => {
  // console.log("payload", payload);
  return loginApi(payload)
    .then((data) => {
      dispatch({
        type: LOGIN,
        payload: data,
      });
      // console.log("data", data);
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

// signUpApi
export const signUpUser = (payload) => (dispatch) => {
  // console.log("payload", payload);
  return signUpApi(payload)
    .then((data) => {
      dispatch({
        type: SIGNUP,
        payload: data,
      });
      // console.log("data", data);
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

// signUpApi
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
