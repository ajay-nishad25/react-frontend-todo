import React, { useEffect, useState } from "react";
import "styles/todo-board.css";
import { ReactComponent as SearchIcon } from "assets/icons/search-icon.svg";
import { ReactComponent as FilterIcon } from "assets/icons/filter-icon.svg";
import { ReactComponent as DeleteIcon } from "assets/icons/delete-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { createTodo, getTodos } from "../redux/actions/todoAction";
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

  useEffect(() => {
    if (page === "") return;
    dispatch(getTodos(page, debouncedSearch));
  }, [dispatch, debouncedSearch, page]);

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

  function handleSaveTask() {
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
      dispatch(getTodos(1));
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

  return (
    <div className="page-layout">
      <div className="page-layout-inner-container">
        {/* task seach, filter and create section */}
        <div className="task-toolbar">
          <div className="search-box">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
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
            <button className="filter-btn">
              <FilterIcon />
              Filter
            </button>
            <div className="new-task-btn">
              <button className="primary-btn" onClick={handleOpenCreateModel}>
                <span className="plus">+</span>
                New Task
              </button>
            </div>
          </div>
        </div>
        {todoDataList?.length > 0 && (
          <div className="task-grid">
            {todoDataList.map((task) => (
              <div className="task-card" key={task.id}>
                <div className="task-card-header">
                  <h3 className="task-title">{task.title}</h3>
                  <button className="delete-btn" title="Delete">
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
        {todoData?.results?.length === 0 && (
          <EmptyState handleOpenCreateModel={handleOpenCreateModel} />
        )}
      </div>
      {/* create task model */}
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

              <button className="save-btn" onClick={handleSaveTask}>
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
    </div>
  );
}
