import { LOGIN, SIGNUP, LOGOUT, RESET_PASSWORD } from "../types";

const token = localStorage.getItem("token");
const userData = token ? JSON.parse(localStorage.getItem("userData")) : null;

const getInitialState = () => {
  if (token && userData) {
    return {
      userLoggedInData: {
        token,
        userData,
      },
      userSignUpData: null,
      userLogoutData: null,
      resetPasswordData: null,
    };
  }
  return {
    userLoggedInData: null,
    userSignUpData: null,
    userLogoutData: null,
    resetPasswordData: null,
  };
};

const initialState = getInitialState();

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN:
      return {
        ...state,
        userLoggedInData: payload,
      };
    case SIGNUP:
      return {
        ...state,
        userSignUpData: payload,
      };
    case LOGOUT:
      return {
        ...state,
        userLogoutData: payload,
      };
    case RESET_PASSWORD:
      return {
        ...state,
        resetPasswordData: payload,
      };
    default:
      return state;
  }
}
