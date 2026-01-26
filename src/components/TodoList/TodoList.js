import React from "react";
import { ReactComponent as DeleteIcon } from "assets/icons/delete-icon.svg";

export default function TodoList({
  viewMode,
  todoDataList,
  openTooUpdateModel,
  setTodoToDelete,
  setIsDeleteClosing,
  setOpenDeleteConfirm,
}) {
  return (
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
  );
}
