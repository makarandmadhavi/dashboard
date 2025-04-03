'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskContext, Task } from '@/app/dashboard/context/TaskContext';
import { createTask } from '@/app/lib/api';
import TaskList from '@/app/dashboard/components/TaskList';

const defaultModels = [
  'Honda Civic',
  'Honda Accord',
  'Toyota Camry',
  'Toyota Corolla',
  'Ford Focus',
  'Ford Mustang',
  'Chevrolet Malibu',
  'Chevrolet Impala',
  'BMW 3 Series',
  'BMW 5 Series',
  'Audi A4',
  'Audi A6',
];

export default function CreateTaskPage() {
  const router = useRouter();
  const { } = useTaskContext();

  // Date pickers
  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [activePreset, setActivePreset] = useState<string>('');

  // Task name
  const defaultTaskName = `Task ${new Date().toLocaleString()}`;
  const [taskName, setTaskName] = useState(defaultTaskName);

  // Dealership selection (Sources)
  const [sourceA, setSourceA] = useState(false); // Prime Auto Sales
  const [sourceB, setSourceB] = useState(false); // Metro Motors

  // Car Models selection
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Close the models dropdown if user clicks outside it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setShowModelDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Preset helpers
  const setLastMonths = (months: number) => {
    const now = new Date();
    const toDateVal = now.toISOString().split('T')[0];
    const pastDate = new Date(now);
    pastDate.setMonth(pastDate.getMonth() - months);
    const fromDateVal = pastDate.toISOString().split('T')[0];
    setFromDate(fromDateVal);
    setToDate(toDateVal);
    setActivePreset(`last${months}m`);
  };

  const setLastYears = (years: number) => {
    const now = new Date();
    const toDateVal = now.toISOString().split('T')[0];
    const pastDate = new Date(now);
    pastDate.setFullYear(pastDate.getFullYear() - years);
    const fromDateVal = pastDate.toISOString().split('T')[0];
    setFromDate(fromDateVal);
    setToDate(toDateVal);
    setActivePreset(`last${years}y`);
  };

  // Model toggles
  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const selectAllModels = () => {
    setSelectedModels(defaultModels);
  };

  const deselectAllModels = () => {
    setSelectedModels([]);
  };

  // Form submit using our server function "createTask" from lib/api.ts
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceA && !sourceB) {
      alert('Please select at least one dealership.');
      return;
    }
    // Build the payload for the API call.
    const payload = {
      name: taskName,
      from_date: fromDate,
      to_date: toDate,
      PrimeAutoSales: sourceA,
      MetroMotors: sourceB,
      car_models: selectedModels, // Optional array of car model filters
    };

    try {
      const response = await createTask(payload);
      console.log("Task created:", response);
      // Optionally, you could refresh the task queue by calling getTasks() here
      // or navigate the user to a different page.
      setShowModal(true);
    } catch (error) {
      console.error(error);
      alert("Error creating task");
    }
  };

  // Reset the form and hide the modal
  const handleNewTask = () => {
    setTaskName(`Task ${new Date().toLocaleString()}`);
    setFromDate(today);
    setToDate(today);
    setActivePreset('');
    setSourceA(false);
    setSourceB(false);
    setSelectedModels([]);
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Create Task Form */}
      <div className="relative">
        <div className={showModal ? 'filter blur-sm' : ''}>
          <h1 className="text-4xl font-bold mb-6 text-gray-100">Create Task</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-slate-800 bg-opacity-90 backdrop-blur-md shadow-lg rounded-lg p-6 space-y-6"
          >
            {/* Task Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Task Name
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-gray-100"
                placeholder="Enter a name for this task..."
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date Range
              </label>
              <div className="flex space-x-4 mb-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-2 text-gray-100"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-2 text-gray-100"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-gray-300 text-sm mr-2">Presets:</span>
                <button
                  type="button"
                  onClick={() => setLastMonths(1)}
                  className={`px-3 py-1 rounded-md text-sm ${activePreset === 'last1m' ? 'bg-teal-700' : 'bg-gray-700'} text-gray-100`}
                >
                  Last Month
                </button>
                <button
                  type="button"
                  onClick={() => setLastMonths(3)}
                  className={`px-3 py-1 rounded-md text-sm ${activePreset === 'last3m' ? 'bg-teal-700' : 'bg-gray-700'} text-gray-100`}
                >
                  Last 3 Months
                </button>
                <button
                  type="button"
                  onClick={() => setLastMonths(6)}
                  className={`px-3 py-1 rounded-md text-sm ${activePreset === 'last6m' ? 'bg-teal-700' : 'bg-gray-700'} text-gray-100`}
                >
                  Last 6 Months
                </button>
                <button
                  type="button"
                  onClick={() => setLastYears(1)}
                  className={`px-3 py-1 rounded-md text-sm ${activePreset === 'last1y' ? 'bg-teal-700' : 'bg-gray-700'} text-gray-100`}
                >
                  Last 1 Year
                </button>
                <button
                  type="button"
                  onClick={() => setLastYears(3)}
                  className={`px-3 py-1 rounded-md text-sm ${activePreset === 'last3y' ? 'bg-teal-700' : 'bg-gray-700'} text-gray-100`}
                >
                  Last 3 Years
                </button>
              </div>
            </div>

            {/* Dealership (Sources) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Dealership
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setSourceA(!sourceA)}
                  className={`px-4 py-2 rounded-md text-sm ${sourceA ? 'bg-teal-700' : 'bg-gray-700'} text-gray-100`}
                >
                  Prime Auto Sales
                </button>
                <button
                  type="button"
                  onClick={() => setSourceB(!sourceB)}
                  className={`px-4 py-2 rounded-md text-sm ${sourceB ? 'bg-teal-700' : 'bg-gray-700'} text-gray-100`}
                >
                  Metro Motors
                </button>
              </div>
            </div>

            {/* Car Models */}
            <div className="relative" ref={modelDropdownRef}>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Car Models
              </label>
              <button
                type="button"
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-left text-gray-100"
              >
                {selectedModels.length === 0
                  ? 'Select Models'
                  : selectedModels.join(', ')}
              </button>
              {showModelDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-md max-h-60 overflow-y-auto">
                  <div className="p-2 border-b border-white/30 flex justify-between items-center">
                    <span className="text-sm text-white">Select All</span>
                    <div>
                      <button
                        type="button"
                        onClick={selectAllModels}
                        className="text-teal-300 text-sm hover:underline mr-2"
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={deselectAllModels}
                        className="text-teal-300 text-sm hover:underline"
                      >
                        None
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {defaultModels.map((model) => (
                      <div
                        key={model}
                        onClick={() => toggleModel(model)}
                        className={`cursor-pointer p-2 rounded-md text-center text-sm ${
                          selectedModels.includes(model)
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-teal-500'
                        }`}
                      >
                        {model}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-gray-100 py-2 px-4 rounded-md"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>

        {/* Modal Overlay */}
        {showModal && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-[#0B1120]/80 backdrop-blur-lg p-6 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-100">Task Created!</h2>
              <p className="mb-4 text-gray-100">Your task is now processing.</p>
              <button
                onClick={handleNewTask}
                className="bg-teal-700 hover:bg-teal-800 text-gray-100 py-2 px-4 rounded-md"
              >
                Start New Task
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Task Queue */}
      <TaskList />

      {/* In this example, task processing is handled by the backend.
          You can refresh the task list via getTasks() from lib/api if needed. */}
    </div>
  );
}
