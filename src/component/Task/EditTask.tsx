import { useState } from "react";
import { TaskData } from "../../types";
import TimeInput from "../TimeInput";
import { invoke } from "@tauri-apps/api/core";

const EditTask: React.FC<{
  task: TaskData;
  sounds: string[];
  onSave: (task: TaskData) => void;
}> = ({ task, sounds, onSave }) => {
  const [taskEditTask, setTaskEditTask] = useState({ ...task });

  const handleTimeChange = (seconds: number) => {
    setTaskEditTask({ ...taskEditTask, timeEnd: seconds });
  };

  return (
    <div>
      <input
        value={taskEditTask.title}
        onChange={(e) =>
          setTaskEditTask({ ...taskEditTask, title: e.target.value })
        }
      />
      <TimeInput
        initialSeconds={taskEditTask.timeEnd}
        onTimeChange={handleTimeChange}
      />
      <input
        type="checkbox"
        checked={taskEditTask.isCyclic}
        onChange={(e) =>
          setTaskEditTask({ ...taskEditTask, isCyclic: e.target.checked })
        }
      />
      <select
        value={taskEditTask.sound}
        onChange={(e) => {
          setTaskEditTask({ ...taskEditTask, sound: e.target.value });
          invoke("play_sound", { fileName: e.target.value });
        }}
      >
        {sounds.map((sound) => (
          <option key={sound} value={sound}>
            {sound}
          </option>
        ))}
      </select>
      <button onClick={() => onSave(taskEditTask)}>💾</button>
    </div>
  );
};

export default EditTask;
