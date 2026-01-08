import React from "react";
import "styles/empty-state.css";

const EmptyState = ({ handleOpenCreateModel }) => {
  return (
    <div className="empty-state-container">
      <div className="tree-box">
        <div className="trunk">
          <div className="leaf-cluster c1"></div>
          <div className="leaf-cluster c2"></div>
          <div className="leaf-cluster c3"></div>
        </div>
      </div>

      <div className="content-area">
        <h2>rooted in peace.</h2>
        <p>
          Your list is clear. Use this quiet moment to branch out into something
          new.
        </p>
      </div>
      <div className="new-task-btn">
        <button className="primary-btn" onClick={handleOpenCreateModel}>
          <span className="plus">+</span>
          New Task
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
