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

export function getTodosApi(
  page,
  debouncedSearch,
  statusFilter,
  orderFilter,
  tagFilter,
  archiveFilter,
  dueDateFilter,
  paginationBatchSize,
) {
  const params = {
    search: debouncedSearch,
    page: page,
    is_archived: archiveFilter === "true" ? true : false,
  };
  if (statusFilter !== null) params.is_completed = statusFilter;
  if (orderFilter) params.sort_order = orderFilter;
  if (tagFilter !== null) params.tag_id = tagFilter;
  if (dueDateFilter !== "") params.due_date = dueDateFilter;

  const batchSize = paginationBatchSize || localStorage.getItem("pageSize");
  if (batchSize) {
    params.pagination_batch_size = batchSize;
  }

  return api
    .get("/get-todos/", { params })
    .then((res) => {
      return Promise.resolve(res?.data);
    })
    .catch((error) => {
      return Promise.reject(error?.response?.data?.error);
    });
}

export function deleteTodoApi(todoId) {
  return api
    .delete("/delete-todo/", {
      params: {
        todo_id: todoId,
      },
    })
    .then((res) => {
      return Promise.resolve(res?.data);
    })
    .catch((error) => {
      return Promise.reject(error?.response?.data?.error);
    });
}

export function updateTodoApi(updateData) {
  return api
    .patch("/update-todo/", updateData)
    .then((res) => {
      return Promise.resolve(res?.data);
    })
    .catch((error) => {
      return Promise.reject(error?.response?.data?.error);
    });
}
