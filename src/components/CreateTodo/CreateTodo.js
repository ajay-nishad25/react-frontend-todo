import React, { useState } from "react";
import { ReactComponent as LeftArrowSquareIcon } from "assets/icons/left-arrow-square.svg";
import { ReactComponent as RightArrowSquareIcon } from "assets/icons/right-arrow-square.svg";

export default function CreateTodo({
  formData,
  handleOnChange,
  formInputError,
  handleCreateTodo,
  handleCloseModal,
  isClosing,
}) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isDrawerClosing, setIsDrawerClosing] = useState(false);

  const toggleDrawer = () => {
    if (drawerOpen) {
      // start closing animation
      setIsDrawerClosing(true);
      setTimeout(() => {
        setDrawerOpen(false);
        setIsDrawerClosing(false);
      }, 150); // must match CSS animation time
    } else {
      setDrawerOpen(true);
    }
  };

  function handleExtraDataInput(fieldName, fieldValue) {
    const currentValue = formData[fieldName];
    let newValue;
    if (currentValue === fieldValue) {
      newValue = null;
    } else {
      newValue = fieldValue;
    }
    handleOnChange({
      target: { name: fieldName, value: newValue },
    });
  }

  const tagListData = [
    { label: "Urgent", class: "tag-urgent", id: 1 },
    { label: "Highest Priority", class: "tag-high", id: 2 },
    { label: "Mid Priority", class: "tag-mid", id: 3 },
    { label: "Low Priority", class: "tag-low", id: 4 },
    { label: "Someday/Maybe", class: "tag-someday", id: 5 },
  ];

  function handleClearDueDate() {
    handleOnChange({
      target: { name: "dueDate", value: "" },
    });
  }

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div
        className={`create-task-modal ${
          isClosing ? "animate-close-create-model" : "animate-open-create-model"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="create-task-body">
          <div className="create-main">
            <div className="div-flex-row-w100 cg-10 div-align-center">
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

              {drawerOpen ? (
                <RightArrowSquareIcon
                  onClick={toggleDrawer}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <LeftArrowSquareIcon
                  onClick={toggleDrawer}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
            <textarea
              name="description"
              placeholder="Write task description..."
              value={formData.description}
              onChange={handleOnChange}
              className="modal-description"
            />
            <div className="div-flex-row div-flex-end">
              <button className="save-btn" onClick={handleCreateTodo}>
                Create
              </button>
            </div>
          </div>

          {(drawerOpen || isDrawerClosing) && (
            <div
              className={`extra-drawer ${
                isDrawerClosing ? "drawer-closing" : "drawer-opening"
              }`}
            >
              <div>
                <div className="drawer-title">Status</div>
                <div className="chip-group">
                  <button
                    className={`task-status ${
                      formData.status === "pending" ? "active-pill" : "pending"
                    }`}
                    onClick={() => handleExtraDataInput("status", "pending")}
                  >
                    Pending
                  </button>
                  <button
                    className={`task-status ${
                      formData.status === "completed"
                        ? "active-pill"
                        : "completed"
                    }`}
                    onClick={() => handleExtraDataInput("status", "completed")}
                  >
                    Completed
                  </button>
                </div>
              </div>

              <div>
                <div className="drawer-title">Tag</div>
                <div className="chip-group wrap">
                  {tagListData.map((tag) => (
                    <button
                      key={tag.id}
                      className={`task-status ${tag.class} ${
                        formData.tagId === tag.id ? "active-pill" : ""
                      }`}
                      onClick={() => handleExtraDataInput("tagId", tag.id)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="drawer-title">Archive </div>
                <div className="div-flex-row-w100 cg-5">
                  <button
                    className={`task-status ${
                      formData.archived ? "active-pill" : ""
                    }`}
                    onClick={() => handleExtraDataInput("archived", true)}
                  >
                    Archive
                  </button>
                  <button
                    className={`task-status ${
                      formData.archived === false ? "active-pill" : ""
                    }`}
                    onClick={() => handleExtraDataInput("archived", false)}
                  >
                    Unarchive
                  </button>
                </div>
              </div>

              <div>
                <div className="drawer-title div-flex-row div-space-between">
                  <span>Due date</span>
                  <button
                    className="common-btn-none"
                    onClick={handleClearDueDate}
                  >
                    <span className="text-sm">Clear</span>
                  </button>
                </div>
                <input
                  type="date"
                  className="date-input"
                  name="dueDate"
                  value={formData.dueDate || ""}
                  onChange={handleOnChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
