import { LOGIN, SIGNUP, LOGOUT } from "../types";

const initialState = {
  userLoggedInData: null,
  userSignUpData: null,
  userLogoutData: null,
};

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

    default:
      return state;
  }
}
