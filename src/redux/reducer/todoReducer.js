import { CREATE_TODO, GET_TODOS, DELETE_TODO } from "../types";

const initialState = {
  createTodo: {},
  todoData: {},
  deleteTodo: {},
};

export default function todoReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_TODO:
      return {
        ...state,
        createTodo: payload,
      };
    case GET_TODOS:
      return {
        ...state,
        todoData: payload,
      };
    case DELETE_TODO:
      return {
        ...state,
        deleteTodo: payload,
      };
    default:
      return state;
  }
}
