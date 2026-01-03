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
      // console.log("payload", payload);
      return {
        ...state,
        userLoggedInData: payload,
      };

    case SIGNUP:
      // console.log("payload", payload);
      return {
        ...state,
        userSignUpData: payload,
      };
    case LOGOUT:
      // console.log("payload", payload);
      return {
        ...state,
        userLogoutData: payload,
      };

    default:
      return state;
  }
}
