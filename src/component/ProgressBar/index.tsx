import React from "react";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  taskName: string;
  progress: number; // progress as a percentage (0 to 100)
  isPaused: boolean;
  onPause: () => void;
  onReset: () => void;
  onEdit: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  taskName: taskName,
  progress,
  isPaused,
  onPause,
  onReset,
  onEdit,
}) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.progress}
        style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
      />
      <span className={styles.text}>{taskName}</span>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={onPause}>
          {isPaused ? "▶️" : "⏸"}
        </button>
        <button className={styles.button} onClick={onReset}>
          🔄
        </button>
        <button className={styles.button} onClick={onEdit}>
          ✏️
        </button>
      </div>
    </div>
  );
};

export default ProgressBar;
