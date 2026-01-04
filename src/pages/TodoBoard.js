import React, { useState } from "react";
import "styles/todo-board.css";
import { ReactComponent as SearchIcon } from "assets/icons/search-icon.svg";
import { ReactComponent as FilterIcon } from "assets/icons/filter-icon.svg";
import { useDispatch } from "react-redux";
import { createTodo } from "../redux/actions/todoAction";

export default function TodoBoard() {
  const dispatch = useDispatch();

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
    dispatch(createTodo(formData)).then((res) => {
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
      handleCloseModal();
    });
  }

  return (
    <div className="page-layout">
      <div className="page-layout-inner-container">
        <div className="task-toolbar">
          <div className="search-box">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="search-input"
            />
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
      </div>

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
