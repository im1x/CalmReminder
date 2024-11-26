import { TaskData } from "../../types";
import ProgressBar from "../ProgressBar";

const Task: React.FC<{
  task: TaskData;
  onEdit: (taskId: number) => void;
  onPause: (id: number) => void;
  onReset: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ task, onEdit, onPause, onReset, onDelete }) => {
  const calculatePercentage = () => (task.time / task.timeEnd) * 100;

  return (
    <div>
      <ProgressBar
        taskName={task.title}
        progress={calculatePercentage()}
        isPaused={task.isPaused}
        onPause={() => onPause(task.id)}
        onReset={() => onReset(task.id)}
        onEdit={() => onEdit(task.id)}
        onDelete={() => onDelete(task.id)}
      />
    </div>
  );
};

export default Task;
