import React from "react";

export default function DeleteConfirmationModel({
  handleCloseDeleteModal,
  isDeleteClosing,
  handleConfirmDelete,
}) {
  return (
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

        <span className="confirm-text">
          Are you sure you want to delete this todo?
          <br />
          This action cannot be undone.
        </span>

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
  );
}
