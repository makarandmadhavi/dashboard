'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTasks, getAggregatedData, getRawTaskData, TaskSummary, RawRecord } from '@/app/lib/api';
import { InteractiveBarChart, InteractiveLineChart } from '@/app/dashboard/components/Charts';
import RawDataTable from '@/app/dashboard/components/RawDataTable';
import FiltersPanel, { RawRecordFilters } from '@/app/dashboard/components/FiltersPanel';
import AggregatedCards from '@/app/dashboard/components/AggregatedCards';
import { Suspense } from 'react';

export interface AggregatedData {
    time_series: { year: number; count: number }[];
    sales_by_car_model: { car_model: string; total_sales: number }[];
}

const AnalyticsPageContent: React.FC = () => {
    const searchParams = useSearchParams();
    const queryTaskParam = searchParams.get('task');
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(
        queryTaskParam ? Number(queryTaskParam) : null
    );
    const [rawData, setRawData] = useState<RawRecord[]>([]);
    const [aggregatedData, setAggregatedData] = useState<AggregatedData | null>(null);
    const [taskList, setTaskList] = useState<TaskSummary[]>([]);

    // Shared filter state (using our RawRecordFilters interface)
    const [filters, setFilters] = useState<RawRecordFilters>({
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
        // (Other filter keys if needed can be added here)
        id: '',
        task_id: '',
    });

    // Fetch tasks on mount
    useEffect(() => {
        async function fetchAllTasks() {
            try {
                const tasks = await getTasks();
                // Filter to only completed tasks (if needed)
                const completedTasks = tasks.filter((t: TaskSummary) => t.status === 'completed');
                setTaskList(completedTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        }
        fetchAllTasks();
    }, []);

    // Fetch raw data when selected task changes
    useEffect(() => {
        if (selectedTaskId !== null) {
            async function fetchData() {
                try {
                    const raw = await getRawTaskData(selectedTaskId);
                    setRawData(raw);
                } catch (error) {
                    console.error('Error fetching raw data:', error);
                }
            }
            fetchData();
        } else {
            // Clear data if no task is selected
            setRawData([]);
        }
    }, [selectedTaskId]);

    // Derive filter options from raw data
    const dealerOptions = useMemo(() => {
        const opts = Array.from(new Set(rawData.map(item => item.dealer)));
        opts.sort();
        return opts;
    }, [rawData]);

    const carModelOptions = useMemo(() => {
        const opts = Array.from(new Set(rawData.map(item => item.car_model)));
        opts.sort();
        return opts;
    }, [rawData]);

    const modelYearOptions = useMemo(() => {
        const opts = Array.from(new Set(rawData.map(item => item.model_year)));
        opts.sort((a, b) => a - b);
        return opts;
    }, [rawData]);

    const colorOptions = useMemo(() => {
        const opts = Array.from(new Set(rawData.map(item => item.color)));
        opts.sort();
        return opts;
    }, [rawData]);

    const typeOptions = useMemo(() => {
        const opts = Array.from(new Set(rawData.map(item => item.type)));
        opts.sort();
        return opts;
    }, [rawData]);

    // Apply filters to raw data
    const filteredData = useMemo(() => {
        return rawData.filter(record => {
            const {
                dealer,
                car_model,
                model_year,
                color,
                type,
                sale_date_from,
                sale_date_to,
                sales_amount_min,
                sales_amount_max,
                engine_capacity_min,
                engine_capacity_max,
            } = filters;
            if (dealer && record.dealer !== dealer) return false;
            if (car_model && record.car_model !== car_model) return false;
            if (model_year && record.model_year.toString() !== model_year) return false;
            if (color && record.color !== color) return false;
            if (type && record.type !== type) return false;
            if (sale_date_from && record.sale_date < sale_date_from) return false;
            if (sale_date_to && record.sale_date > sale_date_to) return false;
            if (sales_amount_min && record.sales_amount < Number(sales_amount_min)) return false;
            if (sales_amount_max && record.sales_amount > Number(sales_amount_max)) return false;
            // For engine_capacity, assume record.engine_capacity is a string like "2.5L"
            const cap = parseFloat(record.engine_capacity);
            if (engine_capacity_min && cap < Number(engine_capacity_min)) return false;
            if (engine_capacity_max && cap > Number(engine_capacity_max)) return false;
            return true;
        });
    }, [rawData, filters]);

    // Compute aggregated data from the filtered data
    const computedAggregatedData = useMemo<AggregatedData | null>(() => {
        if (filteredData.length === 0) return null;

        // Time Series: Count records per year (extract year from sale_date)
        const timeSeriesMap = new Map<number, number>();
        filteredData.forEach(record => {
            const year = Number(record.sale_date.substring(0, 4));
            timeSeriesMap.set(year, (timeSeriesMap.get(year) || 0) + 1);
        });
        const time_series = Array.from(timeSeriesMap.entries())
            .map(([year, count]) => ({ year, count }))
            .sort((a, b) => a.year - b.year);

        // Sales by Car Model: Sum sales_amount by car_model
        const salesMap = new Map<string, number>();
        filteredData.forEach(record => {
            salesMap.set(record.car_model, (salesMap.get(record.car_model) || 0) + record.sales_amount);
        });
        const sales_by_car_model = Array.from(salesMap.entries())
            .map(([car_model, total_sales]) => ({ car_model, total_sales, count: filteredData.filter(record => record.car_model === car_model).length }))
            .sort((a, b) => b.total_sales - a.total_sales);

        return { time_series, sales_by_car_model };
    }, [filteredData]);

    // Handler for filter changes (passed to FiltersPanel)
    const handleFilterChange = (column: keyof RawRecordFilters, value: string) => {
        setFilters(prev => ({ ...prev, [column]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B1120] to-[#0F172A] p-6 text-gray-100">
            <div className="max-w-7xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold">Analytics</h1>

                {/* Task Selection */}
                <div className="bg-gray-900 p-4 rounded shadow">
                    <label className="block mb-2 text-lg font-medium">Select Task</label>
                    <select
                        value={selectedTaskId ?? ''}
                        onChange={(e) =>
                            setSelectedTaskId(e.target.value === '' ? null : Number(e.target.value))
                        }
                        className="p-3 rounded bg-gray-800 text-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                        <option value="">-- Select a Task --</option>
                        {taskList.map(t => (
                            <option key={t.id} value={t.id}>
                                Task #{t.id} - {t.name} (Status: {t.status})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filters Panel */}
                <div className="bg-gray-900 p-4 rounded shadow">
                    <FiltersPanel
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        dealerOptions={dealerOptions}
                        carModelOptions={carModelOptions}
                        modelYearOptions={modelYearOptions}
                        colorOptions={colorOptions}
                        typeOptions={typeOptions}
                    />
                </div>

                {/* Aggregated Cards */}
                {filteredData.length > 0 && (
                    <div className="mb-6">
                        <AggregatedCards data={filteredData} />
                    </div>
                )}

                {/* Interactive Charts */}
                {computedAggregatedData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-900 p-4 rounded shadow">
                            <h2 className="text-xl font-semibold mb-2">Yearly Sales</h2>
                            <InteractiveLineChart data={computedAggregatedData.time_series} filterYear={'all'} />
                        </div>
                        <div className="bg-gray-900 p-4 rounded shadow">
                            <h2 className="text-xl font-semibold mb-2">Sales by Car Model</h2>
                            <InteractiveBarChart
                                data={computedAggregatedData.sales_by_car_model.map((item) => ({ ...item, count: 0 }))}
                                filterCompany={'all'}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400">No aggregated data available. Adjust filters or select a task.</p>
                )}

                {/* Raw Data Table */}
                {filteredData.length > 0 && (
                    <div className="bg-gray-900 p-4 rounded shadow overflow-x-auto">
                        <RawDataTable data={filteredData} />
                    </div>
                )}
            </div>
        </div>
    );
};


export default function AnalyticsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AnalyticsPageContent />
        </Suspense>
    );
}

