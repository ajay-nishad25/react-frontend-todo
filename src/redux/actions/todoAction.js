import { CREATE_TODO, GET_TODOS, DELETE_TODO, UPDATE_TODO } from "../types";
import {
  createTodoApi,
  getTodosApi,
  deleteTodoApi,
  updateTodoApi,
} from "api/todoApi";

export const createTodo = (payload) => (dispatch) => {
  return createTodoApi(payload)
    .then((data) => {
      dispatch({
        type: CREATE_TODO,
        payload: data,
      });
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getTodos =
  (
    page,
    debouncedSearch,
    statusFilter,
    orderFilter,
    tagFilter,
    archiveFilter,
    dueDateFilter,
    paginationBatchSize,
  ) =>
  (dispatch) => {
    return getTodosApi(
      page,
      debouncedSearch,
      statusFilter,
      orderFilter,
      tagFilter,
      archiveFilter,
      dueDateFilter,
      paginationBatchSize,
    )
      .then((data) => {
        dispatch({
          type: GET_TODOS,
          payload: data,
        });
        return Promise.resolve(data);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

export const deleteTodo = (todoId) => (dispatch) => {
  return deleteTodoApi(todoId)
    .then((data) => {
      dispatch({
        type: DELETE_TODO,
        payload: data,
      });
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const updateTodo = (updateData) => (dispatch) => {
  return updateTodoApi(updateData)
    .then((data) => {
      dispatch({
        type: UPDATE_TODO,
        payload: data,
      });
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
