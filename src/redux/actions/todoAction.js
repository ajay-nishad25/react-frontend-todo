import { CREATE_TODO, GET_TODOS } from "../types";
import { createTodoApi, getTodosApi } from "api/todoApi";

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

// getTodosApi

export const getTodos = (page, debouncedSearch) => (dispatch) => {
  // console.log("payload", payload);
  return getTodosApi(page, debouncedSearch)
    .then((data) => {
      dispatch({
        type: GET_TODOS,
        payload: data,
      });
      // console.log("data", data);
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
