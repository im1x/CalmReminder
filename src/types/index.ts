export type TaskData = {
  id: number;
  title: string;
  timeEnd: number;
  time: number;
  isCyclic: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  sound: string;
};

export type TaskContextType = {
  tasks: TaskData[];
  getTaskById: (taskId: number) => TaskData | undefined;
  addTask: (task: TaskData) => void;
  deleteTask: (taskId: number) => void;
  updateTask: (taskId: number, updatedFields: Partial<TaskData>) => void;
};
