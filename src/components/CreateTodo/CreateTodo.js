import React from "react";

export default function CreateTodo({
  formData,
  handleOnChange,
  formInputError,
  handleCreateTodo,
  handleCloseModal,
  isClosing,
}) {
  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div
        className={`create-task-modal ${
          isClosing ? "animate-close-create-model" : "animate-open-create-model"
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
  );
}
