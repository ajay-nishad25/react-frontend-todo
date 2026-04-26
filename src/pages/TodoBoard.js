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
import { useMediaQuery } from "utils/useMediaQuery";

export default function TodoBoard() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  const todoReducer = useSelector((state) => state.todoReducer);

  const [openCreateTodoModel, setOpenCreateTodoModel] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    tagId: "",
    archived: null,
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
    status: "",
    tagId: "",
    archived: null,
    dueDate: "",
  });

  const [openFilter, setOpenFilter] = useState(false);
  const filterRef = useRef(null);

  const [filterFormData, setFilterFormData] = useState(() => {
    const stored = localStorage.getItem("todoFilters");
    if (!stored) {
      return {
        order: null,
        status: null,
        tag: null,
        archive: null,
        dueDate: "",
      };
    }

    const parsed = JSON.parse(stored);

    return {
      ...parsed,
      tag: parsed.tag ? Number(parsed.tag) : null,
    };
  });

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
    dispatch(
      getTodos(
        page,
        debouncedSearch,
        filterFormData?.status,
        filterFormData?.order,
        filterFormData?.tag,
        filterFormData?.archive,
        filterFormData?.dueDate,
        localStorage.getItem("pageSize") || "12"
      ),
    );
  }, [
    dispatch,
    debouncedSearch,
    page,
    filterFormData?.status,
    filterFormData?.order,
    filterFormData?.tag,
    filterFormData?.archive,
    filterFormData?.dueDate,
  ]);

  useEffect(() => {
    localStorage.setItem("todoFilters", JSON.stringify(filterFormData));
    setPage(1);
  }, [filterFormData]);

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

  function handleFilterChange(key, value) {
    setFilterFormData((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  }

  function handleClearDueDate() {
    setFilterFormData((prev) => ({
      ...prev,
      dueDate: "",
    }));
  }

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
      is_completed: formData.status === "completed" ? true : false,
    };

    // Only add optional fields if they exist
    if (formData.tagId) {
      createPayload.tag_id = formData.tagId;
    }

    if (typeof formData.archived === "boolean") {
      createPayload.is_archived = formData.archived;
    }

    if (formData.dueDate) {
      createPayload.due_date = formData.dueDate;
    }

    // call create api
    dispatch(createTodo(createPayload)).then(() => {
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
      dispatch(
        getTodos(
          1,
          debouncedSearch,
          filterFormData?.status,
          filterFormData?.order,
          filterFormData?.tag,
          filterFormData?.archive,
          filterFormData?.dueDate,
          localStorage.getItem("pageSize") || "12"
        ),
      );
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
      dispatch(
        getTodos(
          page,
          debouncedSearch,
          filterFormData?.status,
          filterFormData?.order,
          filterFormData?.tag,
          filterFormData?.archive,
          filterFormData?.dueDate,
          localStorage.getItem("pageSize") || "12"
        ),
      );
      // setPage(1);
      setOpenDeleteConfirm(false);
      setTodoToDelete(null);
    });
  }

  // TEMPORAY
  const tagListData = [
    { label: "Urgent", class: "tag-urgent", id: 1 },
    { label: "Highest Priority", class: "tag-high", id: 2 },
    { label: "Mid Priority", class: "tag-mid", id: 3 },
    { label: "Low Priority", class: "tag-low", id: 4 },
    { label: "Someday/Maybe", class: "tag-someday", id: 5 },
  ];

  function openTooUpdateModel(todo) {
    setUpdateFormData({
      todo_id: todo.id,
      title: todo.title || "",
      description: todo.description || "",
      status: todo.is_completed ? "completed" : "pending",
      tagId:
        tagListData?.filter((tag) => tag.label === todo.tag)[0]?.id || null,
      archived: todo.is_archived || null,
      dueDate: todo.due_date || "",
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

    const updatePayload = {
      todo_id: updateFormData.todo_id,
      title: updateFormData.title,
      description: updateFormData.description,
      is_completed: updateFormData.status === "completed" ? true : false,
      due_date: updateFormData.dueDate || null,
    };

    if (updateFormData.tagId) {
      updatePayload.tag_id = updateFormData.tagId;
    }

    if (typeof updateFormData.archived === "boolean") {
      updatePayload.is_archived = updateFormData.archived;
    }

    dispatch(updateTodo(updatePayload)).then(() => {
      handleCloseUpdateModal();
      dispatch(
        getTodos(
          page,
          debouncedSearch,
          filterFormData?.status,
          filterFormData?.order,
          filterFormData?.tag,
          filterFormData?.archive,
          filterFormData?.dueDate,
          localStorage.getItem("pageSize") || "12"
        ),
      );
    });
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

  const getFilterActiveStatus = () => {
    if (filterFormData) {
      return Object.values(filterFormData).some(
        (value) => value !== null && value !== undefined && value !== "",
      );
    }
    return false;
  };

  return (
    <div className="page-layout">
      <div className="page-layout-inner-container">
        {/* task seach, filter and create section */}
        {isMobile && (
          <div className="search-box-mobile">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search todo..."
              className="search-input"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
        )}
        <div className="task-toolbar">
          {!isMobile && (
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
          )}
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
            {!isMobile && (
              <div className="view-toggle">
                <button className="view-btn" onClick={toggleViewMode}>
                  {viewMode === "card" ? <ListViewIcon /> : <CardViewIcon />}
                </button>
              </div>
            )}

            <div className="filter-wrapper" ref={filterRef}>
              <button
                className={`${
                  getFilterActiveStatus() ? "filter-btn-active" : "filter-btn"
                }`}
                onClick={() => setOpenFilter((prev) => !prev)}
              >
                <FilterIcon />
                Filter
              </button>
              {openFilter && (
                <div className="filter-popover">
                  <div className="filter-section">
                    <div className="filter-title">Sort by order</div>
                    <label className="filter-option">
                      <input
                        type="radio"
                        checked={filterFormData.order === "1"}
                        onClick={() => handleFilterChange("order", "1")}
                      />
                      Latest
                    </label>

                    <label className="filter-option">
                      <input
                        type="radio"
                        checked={filterFormData.order === "2"}
                        onClick={() => handleFilterChange("order", "2")}
                      />
                      Oldest
                    </label>
                  </div>
                  <div className="filter-divider" />
                  <div className="filter-section">
                    <div className="filter-title">Sort by status</div>
                    <label className="filter-option">
                      <input
                        type="radio"
                        checked={filterFormData.status === "false"}
                        onClick={() => handleFilterChange("status", "false")}
                      />
                      Pending
                    </label>

                    <label className="filter-option">
                      <input
                        type="radio"
                        checked={filterFormData.status === "true"}
                        onClick={() => handleFilterChange("status", "true")}
                      />
                      Completed
                    </label>
                  </div>
                  <div className="filter-divider" />
                  <div className="filter-section">
                    <div className="filter-title">Sort by tags</div>

                    {tagListData.map((tag) => (
                      <label key={tag.id} className="filter-option">
                        <input
                          type="radio"
                          checked={filterFormData.tag === tag.id}
                          onClick={() => handleFilterChange("tag", tag.id)}
                        />
                        {tag.label}
                      </label>
                    ))}
                  </div>
                  <div className="filter-divider" />
                  <div className="filter-section">
                    <div className="filter-title">Sort by archive</div>
                    <label className="filter-option">
                      <input
                        type="radio"
                        checked={filterFormData.archive === "true"}
                        onClick={() => handleFilterChange("archive", "true")}
                      />
                      Archive
                    </label>
                  </div>
                  <div className="filter-divider" />
                  <div className="filter-section">
                    <div className="div-flex-row div-space-between div-align-center">
                      <span className="filter-title">Sort by due date</span>
                      <button
                        className="common-btn-none"
                        onClick={handleClearDueDate}
                      >
                        <span className="text-sm">Clear</span>
                      </button>
                    </div>
                    <label className="filter-option">
                      <input
                        type="date"
                        className="date-input"
                        value={filterFormData.dueDate || ""}
                        onChange={(e) =>
                          handleFilterChange("dueDate", e.target.value)
                        }
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="new-task-btn">
              <button className="primary-btn" onClick={handleOpenCreateModel}>
                <span className="plus">+</span>
                <span>Create New</span>
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
