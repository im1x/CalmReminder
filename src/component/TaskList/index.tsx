import { useEffect, useRef, useState } from "react";
import Task from "../Task/Task";
import EditTask from "../Task/EditTask";
import { TaskData } from "../../types";
import { invoke } from "@tauri-apps/api/core";
import { CloseRequestedEvent, Window } from "@tauri-apps/api/window";
import { IconPlus } from "@tabler/icons-react";

const TasksList = () => {
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [sounds, setSounds] = useState<string[]>([]);
  const tasksRef = useRef<TaskData[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const fetchedTasks = await invoke<TaskData[]>("get_tasks");
    setTasks(fetchedTasks);
    tasksRef.current = fetchedTasks;
    setSounds(await invoke<string[]>("get_sounds"));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      tasksRef.current = tasksRef.current.map((task) => {
        if (task.isPaused || task.isCompleted) return task;

        if (task.time >= task.timeEnd) {
          invoke("play_sound", { fileName: task.sound });
          return task.isCyclic
            ? { ...task, time: 0 }
            : { ...task, isCompleted: true };
        }
        return { ...task, time: task.time + 1 };
      });

      setTasks([...tasksRef.current]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentWindow = Window.getCurrent();
    currentWindow.onCloseRequested(async (event: CloseRequestedEvent) => {
      // Prevent the default close behavior
      event.preventDefault();

      // Custom logic before closing
      console.log("Close requested. Saving tasks...");

      try {
        // Example: Save tasks or perform async operations
        await invoke("save_tasks", { tasks: tasksRef.current });
      } catch (error) {
        console.error("Error saving tasks:", error);
      }

      // Allow closing after completing your operations
      await currentWindow.destroy();
    });
  }, []);

  const handleEdit = (id: number) => {
    setEditTaskId(id);
  };

  const handleSave = (updatedTask: TaskData) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      tasksRef.current = newTasks;
      return newTasks;
    });
    setEditTaskId(null);
  };

  const handleDelete = (id: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== id);
      tasksRef.current = updatedTasks;
      return updatedTasks;
    });
  };

  const togglePause = (id: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, isPaused: !task.isPaused } : task
      );
      tasksRef.current = updatedTasks;
      return updatedTasks;
    });
  };

  const handleReset = (id: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, time: 0 } : task
      );
      tasksRef.current = updatedTasks;
      return updatedTasks;
    });
  };

  const addEmptyTask = () => {
    const newTask: TaskData = {
      id: Date.now(),
      title: "",
      time: 0,
      timeEnd: 0,
      isPaused: true,
      isCompleted: false,
      isCyclic: true,
      sound: "Bell",
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    tasksRef.current = [...tasksRef.current, newTask];
    setEditTaskId(newTask.id);
  };

  return (
    <div>
      <h1>Tasks</h1>
      {tasks.map((task) => (
        <div key={task.id}>
          {task.id === editTaskId ? (
            <EditTask task={task} sounds={sounds} onSave={handleSave} />
          ) : (
            <Task
              task={task}
              onEdit={handleEdit}
              onPause={(id) => togglePause(id)}
              onReset={(id) => handleReset(id)}
              onDelete={(id) => handleDelete(id)}
            />
          )}
        </div>
      ))}
      <button onClick={addEmptyTask}>
        <IconPlus />
      </button>
    </div>
  );
};

export default TasksList;
