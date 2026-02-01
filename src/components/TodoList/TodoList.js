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
                className="task-card cursor-pointer"
                key={task.id}
                onClick={() => openTooUpdateModel(task)}
              >
                <div className="task-card-header">
                  <span className="task-date">
                    {new Date(task.created_at).toLocaleDateString()}
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
                <h3 className="task-title">{task.title}</h3>
                <p className="task-desc">
                  {task.description?.trim() ? task.description : "N/A"}
                </p>
                <div className="task-card-footer">
                  <div className="div-flex-row cg-5">
                    <span
                      className={`task-status ${
                        task.is_completed ? "completed" : "pending"
                      }`}
                    >
                      {task.is_completed ? "Completed" : "Pending"}
                    </span>
                    {task.tag && (
                      <span className={`task-status ${tagClass || ""}`}>
                        {task.tag}
                      </span>
                    )}
                  </div>
                  {task?.due_date && (
                    <div className="div-flex-row cg-5 div-align-center">
                      <span className="red-dot-indicator"></span>
                      <span className="div-flex-row cg-5 div-align-center task-date">
                        {new Date(task.due_date).toLocaleDateString()}
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
                  <div className="div-flex-row cg-5 div-align-center">
                    <span
                      className={`task-status ${
                        task.is_completed ? "completed" : "pending"
                      }`}
                    >
                      {task.is_completed ? "Completed" : "Pending"}
                    </span>

                    {task.tag && (
                      <span className={`task-status ${tagClass || ""}`}>
                        {task.tag}
                      </span>
                    )}
                    {task?.due_date && (
                      <div className="div-flex-row cg-5 div-align-center">
                        <span className="red-dot-indicator"></span>
                        <span className="task-date">
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

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
            );
          })}
        </div>
      )}
    </div>
  );
}
