import React from "react";
import styles from "./ViewTask.module.css";
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconReload,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import { TaskData } from "../../../types";

const ViewTask: React.FC<{
  task: TaskData;
  onEdit: (taskId: number) => void;
  onPause: (id: number) => void;
  onReset: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ task, onEdit, onPause, onReset, onDelete }) => {
  const calculatePercentage = () => (task.time / task.timeEnd) * 100;
  return (
    <div className={styles.container}>
      <div
        className={styles.progress}
        style={{ clipPath: `inset(0 ${100 - calculatePercentage()}% 0 0)` }}
      />
      <span className={styles.text}>{task.title}</span>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => onPause(task.id)}>
          {task.isPaused ? <IconPlayerPlay /> : <IconPlayerPause />}
        </button>
        <button className={styles.button} onClick={() => onReset(task.id)}>
          <IconReload />
        </button>
        <button className={styles.button} onClick={() => onEdit(task.id)}>
          <IconSettings />
        </button>
        <button className={styles.button} onClick={() => onDelete(task.id)}>
          <IconX />
        </button>
      </div>
    </div>
  );
};

export default ViewTask;