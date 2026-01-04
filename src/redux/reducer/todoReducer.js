import { CREATE_TODO } from "../types";

const initialState = {
  createTodo: {},
};

export default function todoReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_TODO:
      return {
        ...state,
        createTodo: payload,
      };
    default:
      return state;
  }
}
