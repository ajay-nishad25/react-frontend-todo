import React, { useState } from "react";
import "styles/empty-state.css";

const EmptyState = ({ handleOpenCreateModel }) => {
  const [waving, setWaving] = useState(false);

  function triggerWave() {
    if (waving) return;
    setWaving(true);
    setTimeout(() => setWaving(false), 1600);
  }

  return (
    <div className="empty-state-container">
      {/* ── CAT BUBBLE ── */}
      <div className="cat-bubble" onClick={triggerWave}>
        <div className="cat-body">
          {/* Ears */}
          <div className="ear ear-left" />
          <div className="ear ear-right" />
          <div className="ear-inner ear-inner-left" />
          <div className="ear-inner ear-inner-right" />

          {/* Eyes */}
          <div className="eye eye-left">
            <div className="eye-shine" />
          </div>
          <div className="eye eye-right">
            <div className="eye-shine" />
          </div>

          {/* Nose */}
          <div className="cat-nose" />

          {/* Whiskers */}
          <div className="whisker whisker-left-1" />
          <div className="whisker whisker-left-2" />
          <div className="whisker whisker-right-1" />
          <div className="whisker whisker-right-2" />

          {/* Waving Paw */}
          <div className={`cat-paw ${waving ? "active" : "idle"}`}>
            <div className="toe toe-1" />
            <div className="toe toe-2" />
            <div className="toe toe-3" />
          </div>
        </div>
      </div>

      {/* ── TEXT ── */}
      <div className="empty-content">
        <h2 className="empty-title">meow, it's empty.</h2>
        <p className="empty-subtitle">
          Don't leave me hanging. Tap the cat to wave 👋
        </p>
        <p className="empty-hint">Add your first task below ↓</p>

        <div className="div-flex-row-w100 div-flex-center">
          <div className="new-task-btn">
            <button className="primary-btn" onClick={handleOpenCreateModel}>
              <span className="plus">+</span>
              Create New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
