import { createContext, useContext, useState, type ReactNode } from 'react';
import { INITIAL_TASKS, type Task, type TaskDraft } from '@/utils/tasks';

type TaskContextValue = {
  tasks: Task[];
  saveTask: (draft: TaskDraft, id?: string) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
};
const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  function saveTask(draft: TaskDraft, id?: string) {
    const clean = { ...draft, text: draft.text.trim(), notes: draft.notes.trim(), repeatUntil: draft.repeatInterval === 'No se repite' ? '' : draft.repeatUntil };
    const newId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setTasks(current => id
      ? current.map(task => task.id === id ? { ...task, ...clean } : task)
      : [...current, { ...clean, id: newId, completed: false }]);
  }
  return (
    <TaskContext value={{ tasks, saveTask,
      deleteTask: id => setTasks(current => current.filter(task => task.id !== id)),
      toggleTask: id => setTasks(current => current.map(task => task.id === id ? { ...task, completed: !task.completed } : task)),
    }}>
      {children}
    </TaskContext>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used inside TaskProvider');
  return context;
}
