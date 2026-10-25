import { combineReducers } from "redux";
import { LOGOUT } from "../types";
import authReducer from "./authReducer";
import todoReducer from "./todoReducer";

const appReducer = combineReducers({
  authReducer,
  todoReducer,
});

const rootReducer = (state = {}, action) => {
  if (action.type === LOGOUT) {
    // Reset to initial state by providing empty object;
    // each reducer will use its default initial state
    return appReducer({}, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
