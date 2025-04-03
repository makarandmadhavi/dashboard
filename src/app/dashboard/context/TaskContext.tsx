'use client';
import React, { createContext, useContext, useState } from 'react';

export type TaskStatus = 'pending' | 'in progress' | 'completed';

export interface Task {
  id: number;
  fromYear: number;
  toYear: number;
  sources: { sourceA: boolean; sourceB: boolean };
  carModels: string[];
  status: TaskStatus;
  data?: {
    lineData: { year: number; rows: number }[];
    barData: { company: string; sales: number }[];
  };
  name?: string; // optional custom name
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  function addTask(task: Task) {
    setTasks((prev) => [...prev, task]);
  }

  function updateTask(updated: Task) {
    setTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
