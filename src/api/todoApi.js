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

export function getTodosApi(page, debouncedSearch) {
  const params = {
    search: debouncedSearch,
    page: page,
  };
  return api
    .get("/get-todos/", { params })
    .then((res) => {
      return Promise.resolve(res?.data);
    })
    .catch((error) => {
      return Promise.reject(error?.response?.data?.error);
    });
}
