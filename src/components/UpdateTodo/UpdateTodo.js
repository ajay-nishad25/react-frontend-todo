import React from "react";

export default function UpdateTodo({
  updateFormData,
  handleUpdateChange,
  handleUpdateTodo,
  handleCloseUpdateModal,
  isUpdateClosing,
}) {
  return (
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
  );
}
