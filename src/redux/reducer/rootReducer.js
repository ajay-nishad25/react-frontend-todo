import { combineReducers } from "redux";
import authReducer from "./authReducer";
import todoReducer from "./todoReducer";

const rootReducer = combineReducers({
  authReducer,
  todoReducer,
});

export default rootReducer;
