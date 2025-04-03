'use client';

import React, { useEffect, useState } from 'react';
import { getTasks, getAggregatedData, getRawTaskData, TaskSummary, AggregatedData, RawRecord, RawFilters } from '@/app/lib/api';

export default function RawDataPage() {
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData | null>(null);
  const [rawData, setRawData] = useState<RawRecord[]>([]);
  // Optional: you can add additional filters here.
  const [filters, setFilters] = useState<RawFilters>({});

  // Fetch the list of tasks when the page loads.
  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    fetchTasks();
  }, []);

  // When a task is selected (or filters change), fetch its aggregated and raw data.
  useEffect(() => {
    if (selectedTaskId !== null) {
      async function fetchData() {
        try {
          const aggData = await getAggregatedData(selectedTaskId);
          setAggregatedData(aggData);
          const rawRecords = await getRawTaskData(selectedTaskId, filters);
          setRawData(rawRecords);
        } catch (error) {
          console.error('Error fetching task data:', error);
        }
      }
      fetchData();
    }
  }, [selectedTaskId, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] to-[#0F172A] text-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6">Raw Data Dashboard</h1>
      
      {/* Task Selection */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium">Select Task:</label>
        <select
          value={selectedTaskId ?? ''}
          onChange={(e) =>
            setSelectedTaskId(e.target.value === '' ? null : Number(e.target.value))
          }
          className="p-2 rounded bg-gray-800 text-gray-100"
        >
          <option value="">-- Select a Task --</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              Task #{task.id} - {task.name} (Status: {task.status})
            </option>
          ))}
        </select>
      </div>

      {/* Aggregated Data Section */}
      {selectedTaskId && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Aggregated Data</h2>
          <pre className="bg-gray-800 p-4 rounded whitespace-pre-wrap">
            {aggregatedData ? JSON.stringify(aggregatedData, null, 2) : 'Loading aggregated data...'}
          </pre>
        </div>
      )}

      {/* Raw Records Section */}
      {selectedTaskId && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Raw Records</h2>
          <pre className="bg-gray-800 p-4 rounded whitespace-pre-wrap">
            {rawData ? JSON.stringify(rawData, null, 2) : 'Loading raw data...'}
          </pre>
        </div>
      )}
    </div>
  );
}
