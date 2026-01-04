import api from "./interceptor";

export function createTodoApi(payload) {
  return api
    .post("/create-todo/", payload)
    .then((res) => {
      return Promise.resolve(res?.data?.message);
    })
    .catch((error) => {
      return Promise.reject(error?.response?.data?.error);
    });
}
