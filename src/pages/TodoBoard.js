import React, { useEffect, useRef, useState } from "react";
import "styles/todo-board.css";
import { ReactComponent as SearchIcon } from "assets/icons/search-icon.svg";
import { ReactComponent as FilterIcon } from "assets/icons/filter-icon.svg";
import { ReactComponent as DeleteIcon } from "assets/icons/delete-icon.svg";
import { ReactComponent as CardViewIcon } from "assets/icons/card-view-icon.svg";
import { ReactComponent as ListViewIcon } from "assets/icons/list-view-icon.svg";

import { useDispatch, useSelector } from "react-redux";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../redux/actions/todoAction";
import EmptyState from "components/EmptyState";

export default function TodoBoard() {
  const dispatch = useDispatch();
  const todoReducer = useSelector((state) => state.todoReducer);

  const [openCreateTodoModel, setOpenCreateTodoModel] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [formInputError, setFormInputError] = useState({
    title: {
      status: false,
      message: "",
    },
  });

  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [isDeleteClosing, setIsDeleteClosing] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  const [openUpdateTodoModel, setOpenUpdateTodoModel] = useState(false);
  const [isUpdateClosing, setIsUpdateClosing] = useState(false);

  const [updateFormData, setUpdateFormData] = useState({
    todo_id: "",
    title: "",
    description: "",
    is_completed: false,
  });

  const [openFilter, setOpenFilter] = useState(false);
  const filterRef = useRef(null);

  const [statusFilter, setStatusFilter] = useState(
    localStorage.getItem("todoStatus") || null,
  );

  const [orderFilter, setOrderFilter] = useState(
    localStorage.getItem("todoOrder") || null,
  );

  const [viewMode, setViewMode] = useState(
    localStorage.getItem("todoViewMode") || "card",
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (page === "") return;
    dispatch(getTodos(page, debouncedSearch, statusFilter, orderFilter));
  }, [dispatch, debouncedSearch, page, statusFilter, orderFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // reset pagination when search changes
    }, 600);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { todoData } = todoReducer;

  const todoDataList = todoData?.results;
  const currentPage = todoData?.current_page;
  const totalPages = todoData?.total_pages;

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  function handleOpenCreateModel() {
    setIsClosing(false);
    setOpenCreateTodoModel(true);
  }

  function handleCloseModal() {
    setIsClosing(true);
    setTimeout(() => {
      setOpenCreateTodoModel(false);
      setIsClosing(false);
    }, 250);
    setFormInputError((prev) => {
      return {
        ...prev,
        title: {
          status: false,
          message: "",
        },
      };
    });
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "title") {
      setFormInputError((prev) => {
        return {
          ...prev,
          title: {
            status: false,
            message: "",
          },
        };
      });
    }
  }

  function handleCreateTodo() {
    // validate title is not empty string
    if (!formData.title.trim()) {
      setFormInputError((prev) => {
        return {
          ...prev,
          title: {
            status: true,
            message: "Please enter a title",
          },
        };
      });
      return;
    }

    // call create api
    dispatch(createTodo(formData)).then(() => {
      setFormData({
        title: "",
        description: "",
      });
      setFormInputError((prev) => {
        return {
          ...prev,
          title: {
            status: false,
            message: "",
          },
        };
      });
      setSearchInput("");
      handleCloseModal();
      dispatch(getTodos(1, debouncedSearch, statusFilter, orderFilter));
      setPage(1);
    });
  }

  const handlePrev = () => {
    if (currentPage >= 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage <= totalPages) {
      setPage(currentPage + 1);
    }
  };

  const handleInputPageChange = (e) => {
    const value = e.target.value;
    // allow empty while typing
    if (value === "") {
      setPage("");
      return;
    }
    const page = Number(value);
    if (page > totalPages) {
      return;
    }
    if (!isNaN(page)) {
      setPage(page);
    }
  };

  const handleInputBlur = () => {
    let changedPage = Number(page);
    if (!changedPage || changedPage < 1) changedPage = 1;
    if (changedPage > totalPages) changedPage = totalPages;
    setPage(changedPage);
  };

  function handleCloseDeleteModal() {
    setIsDeleteClosing(true);
    setTimeout(() => {
      setOpenDeleteConfirm(false);
      setIsDeleteClosing(false);
      setTodoToDelete(null);
    }, 250); // match animation duration
  }

  function handleConfirmDelete() {
    if (!todoToDelete) return;

    dispatch(deleteTodo(todoToDelete)).then(() => {
      dispatch(getTodos(page, debouncedSearch, statusFilter, orderFilter));
      // setPage(1);
      setOpenDeleteConfirm(false);
      setTodoToDelete(null);
    });
  }

  function openTooUpdateModel(todo) {
    setUpdateFormData({
      todo_id: todo.id,
      title: todo.title || "",
      description: todo.description || "",
      is_completed: todo.is_completed || false,
    });

    setIsUpdateClosing(false);
    setOpenUpdateTodoModel(true);
  }

  function handleUpdateChange(e) {
    const { name, value, type, checked } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleCloseUpdateModal() {
    setIsUpdateClosing(true);
    setTimeout(() => {
      setOpenUpdateTodoModel(false);
      setIsUpdateClosing(false);
    }, 250);
  }

  function handleUpdateTodo() {
    if (!updateFormData.title.trim()) return;
    dispatch(updateTodo(updateFormData)).then(() => {
      handleCloseUpdateModal();
      dispatch(getTodos(page, debouncedSearch, statusFilter, orderFilter));
    });
  }

  function handleStatusFilter(value) {
    if (statusFilter === value) {
      // toggle OFF
      setStatusFilter(null);
      localStorage.removeItem("todoStatus");
    } else {
      // toggle ON
      setStatusFilter(value);
      localStorage.setItem("todoStatus", value);
    }

    setPage(1);
  }

  function handleOrderFilter(value) {
    if (orderFilter === value) {
      // toggle OFF
      setOrderFilter(null);
      localStorage.removeItem("todoOrder");
    } else {
      // toggle ON
      setOrderFilter(value);
      localStorage.setItem("todoOrder", value);
    }
    setPage(1);
  }

  // close modal on ESCAPE button press
  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === "Escape") {
        if (openCreateTodoModel) handleCloseModal();
        if (openUpdateTodoModel) handleCloseUpdateModal();
        if (openDeleteConfirm) handleCloseDeleteModal();
      }
    }

    window.addEventListener("keydown", handleEscClose);

    return () => {
      window.removeEventListener("keydown", handleEscClose);
    };
  }, [openCreateTodoModel, openUpdateTodoModel, openDeleteConfirm]);

  function toggleViewMode() {
    setViewMode((prev) => {
      const next = prev === "card" ? "list" : "card";
      localStorage.setItem("todoViewMode", next);
      return next;
    });
  }

  return (
    <div className="page-layout">
      <div className="page-layout-inner-container">
        {/* task seach, filter and create section */}
        <div className="task-toolbar">
          <div className="search-box">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search todo..."
              className="search-input"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
          <div className="pagination-wrapper">
            <button
              className="page-btn"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            <div className="page-input-wrapper">
              <input
                type="text"
                value={page}
                onChange={handleInputPageChange}
                onBlur={handleInputBlur}
                className="page-input"
              />
              <div className="page-total">of {totalPages}</div>
            </div>
            <button
              className="page-btn"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>

          <div className="toolbar-actions">
            <div className="filter-wrapper" ref={filterRef}>
              <button
                className="filter-btn"
                onClick={() => setOpenFilter((prev) => !prev)}
              >
                <FilterIcon />
                Filter
              </button>
              {openFilter && (
                <div className="filter-popover">
                  <div className="filter-section">
                    <div className="filter-title">Sort by status</div>
                    <label className="filter-option">
                      <input
                        type="radio"
                        checked={statusFilter === "false"}
                        onClick={() => handleStatusFilter("false")}
                      />
                      Pending
                    </label>

                    <label className="filter-option">
                      <input
                        type="radio"
                        checked={statusFilter === "true"}
                        onClick={() => handleStatusFilter("true")}
                      />
                      Completed
                    </label>
                  </div>
                  <div className="filter-divider" />
                  <div className="filter-section">
                    <div className="filter-title">Sort by order</div>
                    <label className="filter-option">
                      <input
                        type="radio"
                        checked={orderFilter === "1"}
                        onClick={() => handleOrderFilter("1")}
                      />
                      Latest
                    </label>

                    <label className="filter-option">
                      <input
                        type="radio"
                        checked={orderFilter === "2"}
                        onClick={() => handleOrderFilter("2")}
                      />
                      Oldest
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="view-toggle">
              <button className="view-btn" onClick={toggleViewMode}>
                {viewMode === "card" ? <ListViewIcon /> : <CardViewIcon />}
              </button>
            </div>

            <div className="new-task-btn">
              <button className="primary-btn" onClick={handleOpenCreateModel}>
                <span className="plus">+</span>
                New Task
              </button>
            </div>
          </div>
        </div>
        <div className={`view-container ${viewMode}`}>
          {viewMode === "card" && (
            <div className="task-grid">
              {todoDataList?.map((task) => (
                <div
                  className="task-card cursor-pointer"
                  key={task.id}
                  onClick={() => openTooUpdateModel(task)}
                >
                  <div className="task-card-header">
                    <h3 className="task-title">{task.title}</h3>
                    <button
                      className="delete-btn"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTodoToDelete(task.id);
                        setIsDeleteClosing(false);
                        setOpenDeleteConfirm(true);
                      }}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                  <p className="task-desc">
                    {task.description?.trim() ? task.description : "N/A"}
                  </p>
                  <div className="task-card-footer">
                    <span
                      className={`task-status ${
                        task.is_completed ? "completed" : "pending"
                      }`}
                    >
                      {task.is_completed ? "Completed" : "Pending"}
                    </span>

                    <span className="task-date">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {viewMode === "list" && (
            <div className="task-list">
              {todoDataList?.map((task) => (
                <div
                  key={task.id}
                  className="task-list-row cursor-pointer"
                  onClick={() => openTooUpdateModel(task)}
                >
                  <div className="task-list-main">
                    <div className="task-title">{task.title}</div>
                    <div className="task-desc">
                      {task.description?.trim() ? task.description : "N/A"}
                    </div>
                  </div>

                  <div className="task-list-meta">
                    <span
                      className={`task-status ${
                        task.is_completed ? "completed" : "pending"
                      }`}
                    >
                      {task.is_completed ? "Completed" : "Pending"}
                    </span>

                    <span className="task-date">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>

                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTodoToDelete(task.id);
                        setIsDeleteClosing(false);
                        setOpenDeleteConfirm(true);
                      }}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {todoDataList?.length === 0 && (
          <EmptyState handleOpenCreateModel={handleOpenCreateModel} />
        )}
      </div>
      {/* CREATE TASK MODEL */}
      {openCreateTodoModel && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className={`create-task-modal ${
              isClosing
                ? "animate-close-create-model"
                : "animate-open-create-model"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleOnChange}
                className={`modal-title-input ${
                  formInputError.title.status ? "input-error" : ""
                }`}
              />
              <button className="save-btn" onClick={handleCreateTodo}>
                Save
              </button>
            </div>

            <textarea
              name="description"
              placeholder="Write task description..."
              value={formData.description}
              onChange={handleOnChange}
              className="modal-description"
            />
          </div>
        </div>
      )}
      {/* DELETE CONFIRMATION MODAL */}
      {openDeleteConfirm && (
        <div className="modal-overlay" onClick={handleCloseDeleteModal}>
          <div
            className={`confirm-modal ${
              isDeleteClosing
                ? "animate-close-create-model"
                : "animate-open-create-model"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="confirm-title">Delete Todo</h3>

            <p className="confirm-text">
              Are you sure you want to delete this todo?
              <br />
              This action cannot be undone.
            </p>

            <div className="confirm-actions">
              <button className="cancel-btn" onClick={handleCloseDeleteModal}>
                Cancel
              </button>

              <button className="danger-btn" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE TODO MODAL */}
      {openUpdateTodoModel && (
        <div className="modal-overlay" onClick={handleCloseUpdateModal}>
          <div
            className={`create-task-modal ${
              isUpdateClosing
                ? "animate-close-create-model"
                : "animate-open-create-model"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={updateFormData.title}
                onChange={handleUpdateChange}
                className={`modal-title-input ${
                  updateFormData.title === "" ? "input-error" : ""
                }`}
              />

              <button className="save-btn" onClick={handleUpdateTodo}>
                Update
              </button>
            </div>

            <textarea
              name="description"
              placeholder="Write task description..."
              value={updateFormData.description}
              onChange={handleUpdateChange}
              className="modal-description"
            />

            <label className="div-flex-row div-align-center mark-completed-text">
              <input
                type="checkbox"
                name="is_completed"
                checked={updateFormData.is_completed}
                onChange={handleUpdateChange}
              />
              Mark as completed
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
