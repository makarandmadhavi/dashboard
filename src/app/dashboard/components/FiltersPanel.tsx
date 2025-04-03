'use client';

import React, { useState } from 'react';
import Slider from '@mui/material/Slider';

export interface RawRecordFilters {
  id: string;
  task_id: string;
  dealer: string;
  sale_date: string;
  car_model: string;
  sales_amount: string;
  color: string;
  engine_capacity: string;
  model_year: string;
  horsepower: string;
  type: string;
  sale_date_from: string;
  sale_date_to: string;
  sales_amount_min: string;
  sales_amount_max: string;
  engine_capacity_min: string;
  engine_capacity_max: string;
}

interface FiltersPanelProps {
  filters: RawRecordFilters;
  onFilterChange: (column: keyof RawRecordFilters, value: string) => void;
  dealerOptions: string[];
  carModelOptions: string[];
  modelYearOptions: number[];
  colorOptions: string[];
  typeOptions: string[];
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFilterChange,
  dealerOptions,
  carModelOptions,
  modelYearOptions,
  colorOptions,
  typeOptions,
}) => {
  // Set collapsed by default
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 p-4 rounded mb-4">
      <button
        className="text-teal-400 mb-4 focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? 'Hide Filters ▲' : 'Show Filters ▼'}
      </button>
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dealer Filter */}
          <div>
            <label className="block mb-1">Dealer</label>
            <select
              className="p-2 rounded bg-gray-700 text-gray-100 w-full"
              value={filters.dealer}
              onChange={(e) => onFilterChange('dealer', e.target.value)}
            >
              <option value="">All</option>
              {dealerOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          {/* Car Model Filter */}
          <div>
            <label className="block mb-1">Car Model</label>
            <select
              className="p-2 rounded bg-gray-700 text-gray-100 w-full"
              value={filters.car_model}
              onChange={(e) => onFilterChange('car_model', e.target.value)}
            >
              <option value="">All</option>
              {carModelOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          {/* Model Year Filter */}
          <div>
            <label className="block mb-1">Model Year</label>
            <select
              className="p-2 rounded bg-gray-700 text-gray-100 w-full"
              value={filters.model_year}
              onChange={(e) => onFilterChange('model_year', e.target.value)}
            >
              <option value="">All</option>
              {modelYearOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          {/* Color Filter */}
          <div>
            <label className="block mb-1">Color</label>
            <select
              className="p-2 rounded bg-gray-700 text-gray-100 w-full"
              value={filters.color}
              onChange={(e) => onFilterChange('color', e.target.value)}
            >
              <option value="">All</option>
              {colorOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          {/* Type Filter */}
          <div>
            <label className="block mb-1">Type</label>
            <select
              className="p-2 rounded bg-gray-700 text-gray-100 w-full"
              value={filters.type}
              onChange={(e) => onFilterChange('type', e.target.value)}
            >
              <option value="">All</option>
              {typeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          {/* Sale Date Range */}
          <div className="md:col-span-3">
            <label className="block mb-1">Sale Date Range</label>
            <div className="flex space-x-2">
              <input
                type="date"
                className="p-2 rounded bg-gray-700 text-gray-100 w-full"
                value={filters.sale_date_from}
                onChange={(e) => onFilterChange('sale_date_from', e.target.value)}
              />
              <input
                type="date"
                className="p-2 rounded bg-gray-700 text-gray-100 w-full"
                value={filters.sale_date_to}
                onChange={(e) => onFilterChange('sale_date_to', e.target.value)}
              />
            </div>
          </div>
          {/* Engine Capacity Range Slider */}
          <div className="m-2">
            <label className="block mb-1">Engine Capacity (L)</label>
            <Slider
              value={
                filters.engine_capacity_min !== '' && filters.engine_capacity_max !== ''
                  ? [Number(filters.engine_capacity_min), Number(filters.engine_capacity_max)]
                  : [1.0, 5.0]
              }
              min={1.0}
              max={5.0}
              step={0.1}
              onChange={(_, newValue) => {
                if (Array.isArray(newValue)) {
                  onFilterChange('engine_capacity_min', String(newValue[0]));
                  onFilterChange('engine_capacity_max', String(newValue[1]));
                }
              }}
              valueLabelDisplay="auto"
              className="w-full"
            />
          </div>
          {/* Sales Amount Range Slider */}
          <div className="m-2">
            <label className="block mb-1">Sales Amount</label>
            <Slider
              value={
                filters.sales_amount_min !== '' && filters.sales_amount_max !== ''
                  ? [Number(filters.sales_amount_min), Number(filters.sales_amount_max)]
                  : [0, 100000]
              }
              min={0}
              max={100000}
              step={1000}
              onChange={(_, newValue) => {
                if (Array.isArray(newValue)) {
                  onFilterChange('sales_amount_min', String(newValue[0]));
                  onFilterChange('sales_amount_max', String(newValue[1]));
                }
              }}
              valueLabelDisplay="auto"
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;
