import React from "react";
import "styles/taskCard.css";

export default function TaskCard({ task, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>

        <button
          className="task-delete-btn"
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          ×
        </button>
      </div>

      <p className="task-desc">{task.description}</p>

      <div className="task-card-footer">
        <span className={`task-status ${task.status}`}>{task.status}</span>

        <span className="task-date">{task.createdAt}</span>
      </div>
    </div>
  );
}
