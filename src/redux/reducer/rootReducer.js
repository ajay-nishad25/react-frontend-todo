import { combineReducers } from "redux";
import { LOGOUT } from "../types";
import authReducer from "./authReducer";
import todoReducer from "./todoReducer";

const appReducer = combineReducers({
  authReducer,
  todoReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined; // resets every reducer to its initialState
  }
  return appReducer(state, action);
};

export default rootReducer;
