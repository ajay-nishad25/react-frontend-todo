import { CREATE_TODO } from "../types";
import { createTodoApi } from "api/todoApi";

// signUpApi
export const createTodo = (payload) => (dispatch) => {
  // console.log("payload", payload);
  return createTodoApi(payload)
    .then((data) => {
      dispatch({
        type: CREATE_TODO,
        payload: data,
      });
      // console.log("data", data);
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
