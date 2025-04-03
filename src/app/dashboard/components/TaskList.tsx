'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks } from '@/app/lib/api';

export default function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    // Fetch immediately on mount
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks(); // 👈 initial load

    // Set up polling every 5 seconds
    const intervalId = setInterval(fetchTasks, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Task Queue</h2>
      <div className="space-y-4">
        {[...tasks]
          .sort((a, b) => b.id - a.id) // Newest first
          .map((task) => (
            <div
              key={task.id}
              onClick={() => router.push(`/dashboard/analytics?task=${task.id}`)}
              className="p-4 bg-slate-900 shadow rounded-lg flex justify-between items-center cursor-pointer hover:bg-slate-800"
            >
              <div>
                <p className="font-semibold text-gray-100">
                  {task.name ? task.name : `Task #${task.id}`}
                </p>
                <p className="text-sm text-gray-400">Status: {task.status}</p>
              </div>
              {task.status === 'completed' ? (
                <span className="text-green-400 font-bold">Completed</span>
              ) : (
                <span className="text-yellow-400 font-bold">{task.status}</span>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
