import React, { useEffect, useRef, useState } from "react";
import "styles/todo-board.css";
import { ReactComponent as SearchIcon } from "assets/icons/search-icon.svg";
import { ReactComponent as FilterIcon } from "assets/icons/filter-icon.svg";
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
import CreateTodo from "components/CreateTodo/CreateTodo";
import UpdateTodo from "components/UpdateTodo/UpdateTodo";
import DeleteConfirmationModel from "components/UpdateTodo/DeleteConfirmationModel";
import TodoList from "components/TodoList/TodoList";

export default function TodoBoard() {
  const dispatch = useDispatch();
  const todoReducer = useSelector((state) => state.todoReducer);

  const [openCreateTodoModel, setOpenCreateTodoModel] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    statusId: "",
    tagId: "",
    archived: null,
    pinned: null,
    dueDate: "",
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

    const createPayload = {
      title: formData.title,
      description: formData.description,
      status_id: formData.statusId,
      tag_id: formData.tagId,
      archived: formData.archived,
      pinned: formData.pinned,
      dueDate: formData.dueDate,
    };

    console.log(createPayload);

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
        <TodoList
          viewMode={viewMode}
          todoDataList={todoDataList}
          openTooUpdateModel={openTooUpdateModel}
          setTodoToDelete={setTodoToDelete}
          setIsDeleteClosing={setIsDeleteClosing}
          setOpenDeleteConfirm={setOpenDeleteConfirm}
        />
        {todoDataList?.length === 0 && (
          <EmptyState handleOpenCreateModel={handleOpenCreateModel} />
        )}
      </div>
      {/* CREATE TASK MODEL */}
      {openCreateTodoModel && (
        <CreateTodo
          formData={formData}
          handleOnChange={handleOnChange}
          formInputError={formInputError}
          handleCreateTodo={handleCreateTodo}
          handleCloseModal={handleCloseModal}
          isClosing={isClosing}
        />
      )}
      {/* DELETE CONFIRMATION MODAL */}
      {openDeleteConfirm && (
        <DeleteConfirmationModel
          handleCloseDeleteModal={handleCloseDeleteModal}
          isDeleteClosing={isDeleteClosing}
          handleConfirmDelete={handleConfirmDelete}
        />
      )}

      {/* UPDATE TODO MODAL */}
      {openUpdateTodoModel && (
        <UpdateTodo
          updateFormData={updateFormData}
          handleUpdateChange={handleUpdateChange}
          handleUpdateTodo={handleUpdateTodo}
          handleCloseUpdateModal={handleCloseUpdateModal}
          isUpdateClosing={isUpdateClosing}
        />
      )}
    </div>
  );
}
