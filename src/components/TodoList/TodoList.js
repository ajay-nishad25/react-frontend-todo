import React from "react";
import { ReactComponent as DeleteIcon } from "assets/icons/delete-icon.svg";
import { ReactComponent as ArchiveIcon } from "assets/icons/archive-icon.svg";

// Formats an ISO date string to DD/MM/YY.
// For date-only strings (YYYY-MM-DD) we append T00:00:00 so the local
// date is used instead of UTC, preventing an off-by-one-day issue.
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  const date = new Date(isDateOnly ? `${dateStr}T00:00:00` : dateStr);
  if (isNaN(date)) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
};

export default function TodoList({
  viewMode,
  todoDataList,
  openTooUpdateModel,
  setTodoToDelete,
  setIsDeleteClosing,
  setOpenDeleteConfirm,
}) {
  const TAG_MAP = {
    Urgent: "tag-urgent",
    "Highest Priority": "tag-high",
    "Mid Priority": "tag-mid",
    "Low Priority": "tag-low",
    "Someday/Maybe": "tag-someday",
  };
  return (
    <div className={`view-container ${viewMode}`}>
      {viewMode === "card" && (
        <div className="task-grid">
          {todoDataList?.map((task) => {
            const tagClass = TAG_MAP[task.tag];
            return (
              <div
                className={`task-card cursor-pointer${task.is_completed ? " task-completed" : ""}`}
                key={task.id}
                onClick={() => openTooUpdateModel(task)}
              >
                <div className="task-card-header">
                  <span className="task-date">
                    {formatDate(task.created_at)}
                  </span>
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
                <h3 className={`task-title${task.is_completed ? " task-title-completed" : ""}`}>{task.title}</h3>
                <p className="task-desc">
                  {task.description?.trim() ? task.description : "N/A"}
                </p>
                <div className="task-card-footer">
                  <div className="div-flex-row div-align-center cg-5">
                    <span
                      className={`task-status ${
                        task.is_completed ? "completed" : "pending"
                      }`}
                    >
                      {task.is_completed ? "Completed" : "Pending"}
                    </span>
                    {task.tag && (
                      <span className={`task-status ${tagClass || ""} ${task?.is_completed ? "task-tag-completed" : ""}`}>
                        {task.tag}
                      </span>
                    )}
                    {task?.is_archived && (
                      <span className="div-align-center task-archive">
                        <ArchiveIcon className="icon-size-18" />
                      </span>
                    )}
                  </div>
                  {task?.due_date && (
                    <div className="div-flex-row cg-5 div-align-center">
                      <span className="red-dot-indicator"></span>
                      <span
                        className={`div-flex-row cg-5 div-align-center ${
                          task?.is_completed
                            ? "task-due-date-completed"
                            : "task-date"
                        }`}
                      >
                        {formatDate(task.due_date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {viewMode === "list" && (
        <div className="task-list">
          {todoDataList?.map((task) => {
            const tagClass = TAG_MAP[task.tag];
            return (
              <div
                key={task.id}
                className={`task-list-row cursor-pointer${task.is_completed ? " task-completed" : ""}`}
                onClick={() => openTooUpdateModel(task)}
              >
                <div className="task-list-main">
                  <div className={`task-title${task.is_completed ? " task-title-completed" : ""}`}>{task.title}</div>
                  <div className="task-desc">
                    {task.description?.trim() ? task.description : "N/A"}
                  </div>
                </div>

                <div className="task-list-meta">
                  <div className="div-flex-row cg-5 div-align-center">
                    <span
                      className={`task-status ${
                        task.is_completed ? "completed" : "pending"
                      }`}
                    >
                      {task.is_completed ? "Completed" : "Pending"}
                    </span>

                    {task.tag && (
                      <span className={`task-status ${tagClass || ""} ${task?.is_completed ? "task-tag-completed" : ""}`}>
                        {task.tag}
                      </span>
                    )}
                    {task?.is_archived && (
                      <span className="div-align-center task-status task-archive">
                        <ArchiveIcon className="icon-size-18" />
                      </span>
                    )}
                    {task?.due_date && (
                      <div className="div-flex-row cg-5 div-align-center">
                        <span className="red-dot-indicator"></span>
                        <span
                          className={`${
                            task?.is_completed
                              ? "task-due-date-completed"
                              : "task-date"
                          }`}
                        >
                          {formatDate(task.due_date)}
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="task-date">
                    {formatDate(task.created_at)}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
