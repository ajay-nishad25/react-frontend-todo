import { CREATE_TODO, GET_TODOS } from "../types";

const initialState = {
  createTodo: {},
  todoData: {},
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
    default:
      return state;
  }
}
