import { CREATE_TODO, GET_TODOS, DELETE_TODO } from "../types";
import { createTodoApi, getTodosApi, deleteTodoApi } from "api/todoApi";

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

export const deleteTodo = (todoId) => (dispatch) => {
  // console.log("payload", payload);
  return deleteTodoApi(todoId)
    .then((data) => {
      dispatch({
        type: DELETE_TODO,
        payload: data,
      });
      // console.log("data", data);
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
