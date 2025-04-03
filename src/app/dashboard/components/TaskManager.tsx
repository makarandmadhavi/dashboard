'use client';
import React, { useEffect, useRef } from 'react';
import { useTaskContext, Task } from '../context/TaskContext';

interface TaskManagerProps {
  newTask: Task;
  onTaskProcessed: () => void;
}

export default function TaskManager({ newTask, onTaskProcessed }: TaskManagerProps) {
  const { addTask, updateTask } = useTaskContext();
  const hasProcessed = useRef(false);

  // Helper function to simulate generating data for the task.
  function generateSimulatedDataForTask(task: Task) {
    const fromYear = task.fromYear;
    const toYear = task.toYear;
    const lineData: { year: number; rows: number }[] = [];
    for (let year = fromYear; year <= toYear; year++) {
      lineData.push({ year, rows: Math.floor(Math.random() * 1000) });
    }

    const barData: { company: string; sales: number }[] = [];
    if (task.carModels.length > 0) {
      task.carModels.forEach((model) => {
        if (task.sources.sourceA || task.sources.sourceB) {
          barData.push({ company: model, sales: Math.floor(Math.random() * 3000) });
        }
      });
    } else {
      if (task.sources.sourceA) {
        barData.push({ company: 'Source A', sales: Math.floor(Math.random() * 5000) });
      }
      if (task.sources.sourceB) {
        barData.push({ company: 'Source B', sales: Math.floor(Math.random() * 5000) });
      }
    }

    return { lineData, barData };
  }

  // Process the task (mocked API calls)
  async function processTask(task: Task): Promise<void> {
    // Immediately add the task to context
    addTask(task);

    // Simulate backend call to set "in progress"
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateTask({ ...task, status: 'in progress' });

    // Simulate further processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const simulatedData = generateSimulatedDataForTask(task);

    // Mark task as completed
    updateTask({ ...task, status: 'completed', data: simulatedData });
  }

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    processTask(newTask).then(() => {
      onTaskProcessed();
    });
  }, [newTask, onTaskProcessed]);

  return null;
}
