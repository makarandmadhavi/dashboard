'use client';

import React, { useState, useMemo } from 'react';
import FiltersPanel, { RawRecordFilters } from './FiltersPanel';

export interface RawRecord {
  id: number;
  task_id: number;
  dealer: string;
  sale_date: string;
  car_model: string;
  sales_amount: number;
  color: string;
  engine_capacity: string; // e.g., "2.5L"
  model_year: number;
  horsepower: number;
  type: string;
}

interface RawDataTableProps {
  data: RawRecord[];
}

const RawDataTable: React.FC<RawDataTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Use the filters interface from FiltersPanel
  const [filters, setFilters] = useState<RawRecordFilters>({
    id: '',
    task_id: '',
    dealer: '',
    sale_date: '',
    car_model: '',
    sales_amount: '',
    color: '',
    engine_capacity: '',
    model_year: '',
    horsepower: '',
    type: '',
    sale_date_from: '',
    sale_date_to: '',
    sales_amount_min: '',
    sales_amount_max: '',
    engine_capacity_min: '',
    engine_capacity_max: '',
  });

  // Derived options for dropdown filters
  const dealerOptions = useMemo(() => Array.from(new Set(data.map((d) => d.dealer))), [data]);
  const carModelOptions = useMemo(() => Array.from(new Set(data.map((d) => d.car_model))), [data]);
  const modelYearOptions = useMemo(() => Array.from(new Set(data.map((d) => d.model_year))).sort(), [data]);
  const colorOptions = useMemo(() => Array.from(new Set(data.map((d) => d.color))), [data]);
  const typeOptions = useMemo(() => Array.from(new Set(data.map((d) => d.type))), [data]);

  // Apply column-specific filters
  const filteredData = useMemo(() => {
    return data.filter((record) => {
      const {
        dealer,
        sale_date,
        car_model,
        sales_amount,
        color,
        engine_capacity,
        model_year,
        horsepower,
        type,
        sale_date_from,
        sale_date_to,
        sales_amount_min,
        sales_amount_max,
        engine_capacity_min,
        engine_capacity_max,
      } = filters;

      if (dealer && record.dealer.toLowerCase() !== dealer.toLowerCase()) return false;
      if (car_model && record.car_model.toLowerCase() !== car_model.toLowerCase()) return false;
      if (model_year && record.model_year.toString() !== model_year) return false;
      if (color && record.color.toLowerCase() !== color.toLowerCase()) return false;
      if (type && record.type.toLowerCase() !== type.toLowerCase()) return false;
      if (sale_date && !record.sale_date.includes(sale_date)) return false;
      if (sales_amount && record.sales_amount.toString().indexOf(sales_amount) === -1) return false;
      if (engine_capacity && record.engine_capacity.toLowerCase().indexOf(engine_capacity.toLowerCase()) === -1)
        return false;
      if (horsepower && record.horsepower.toString().indexOf(horsepower) === -1) return false;

      // Sale date range
      if (sale_date_from && record.sale_date < sale_date_from) return false;
      if (sale_date_to && record.sale_date > sale_date_to) return false;

      // Engine capacity: parse numeric part from string (e.g., "2.5L")
      const capValue = parseFloat(record.engine_capacity);
      if (engine_capacity_min && capValue < Number(engine_capacity_min)) return false;
      if (engine_capacity_max && capValue > Number(engine_capacity_max)) return false;

      // Sales amount
      if (sales_amount_min && record.sales_amount < Number(sales_amount_min)) return false;
      if (sales_amount_max && record.sales_amount > Number(sales_amount_max)) return false;

      return true;
    });
  }, [data, filters]);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof RawRecord>('sale_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedData = useMemo(() => {
    return filteredData.slice().sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (column: keyof RawRecord) => {
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (column: keyof RawRecordFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
    setCurrentPage(1);
  };

  // Fixed column width (10% for each of 10 columns)
  const columnStyle = { width: '10%' };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Raw Data Table</h2>

      {/* Raw Data Table */}
      <div className="overflow-x-auto">
        <table className="table-fixed w-full bg-gray-800 border border-gray-700">
          <thead>
            <tr className="h-10">
              {[
                { key: 'id', label: 'ID' },
                { key: 'sale_date', label: 'Sale Date' },
                { key: 'dealer', label: 'Dealer' },
                { key: 'car_model', label: 'Car Model' },
                { key: 'sales_amount', label: 'Sales Amount' },
                { key: 'color', label: 'Color' },
                { key: 'engine_capacity', label: 'Engine Cap' },
                { key: 'model_year', label: 'Model Year' },
                { key: 'horsepower', label: 'Horsepower' },
                { key: 'type', label: 'Type' },
              ].map((col) => (
                <th
                  key={col.key}
                  style={columnStyle}
                  className="p-2 border-b border-gray-700 cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort(col.key as keyof RawRecord)}
                >
                  {col.label}
                  {sortColumn === col.key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((record) => (
              <tr key={record.id} className="h-12 hover:bg-gray-700">
                <td style={columnStyle} className="p-2 border-b border-gray-700">{record.id}</td>
                <td style={columnStyle} className="p-2 border-b border-gray-700">{record.sale_date}</td>
                <td style={columnStyle} className="p-2 border-b border-gray-700">{record.dealer}</td>
                <td style={columnStyle} className="p-2 border-b border-gray-700">{record.car_model}</td>
                <td style={columnStyle} className="p-2 border-b border-gray-700">{record.sales_amount}</td>
                <td style={columnStyle} className="p-2 border-b border-gray-700">{record.color}</td>
                <td style={columnStyle} className="p-2 border-b border-gray-700">{record.engine_capacity}</td>
                <td style={columnStyle} className="p-2 border-b border-gray-700">{record.model_year}</td>
                <td style={columnStyle} className="p-2 border-b border-gray-700">{record.horsepower}</td>
                <td style={columnStyle} className="p-2 border-b border-gray-700">{record.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-3 py-1 rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-3 py-1 rounded"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RawDataTable;
