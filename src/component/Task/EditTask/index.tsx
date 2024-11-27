import { useState } from "react";
import { TaskData } from "../../../types";
import TimeInput from "../../TimeInput";
import { invoke } from "@tauri-apps/api/core";
import { IconDeviceFloppy, IconReload } from "@tabler/icons-react";

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
    <div className="glassmorphism-bg sp-ad">
      <input
        className="half-transparent"
        value={taskEditTask.title}
        onChange={(e) =>
          setTaskEditTask({ ...taskEditTask, title: e.target.value })
        }
      />
      <TimeInput
        initialSeconds={taskEditTask.timeEnd}
        onTimeChange={handleTimeChange}
      />

      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <IconReload color="white" />
        <input
          type="checkbox"
          style={{ width: "20px", height: "20px" }}
          checked={taskEditTask.isCyclic}
          onChange={(e) =>
            setTaskEditTask({ ...taskEditTask, isCyclic: e.target.checked })
          }
        />
      </span>

      <select
        className="half-transparent"
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
      <button className="glass-button" onClick={() => onSave(taskEditTask)}>
        <IconDeviceFloppy />
      </button>
    </div>
  );
};

export default EditTask;
