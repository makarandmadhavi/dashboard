'use server';

const BASE_URL = 'http://127.0.0.1:5000';

export interface CreateTaskPayload {
  name?: string;
  from_date: string; // Format: YYYY-MM-DD
  to_date: string;   // Format: YYYY-MM-DD
  PrimeAutoSales: boolean;
  MetroMotors: boolean;
  car_models?: string[];
}

export interface CreateTaskResponse {
  message: string;
  task_id: number;
}

export async function createTask(payload: CreateTaskPayload): Promise<CreateTaskResponse> {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to create task: ${await res.text()}`);
  }
  return res.json();
}

export interface TaskSummary {
  id: number;
  name: string;
  created_at: string; // formatted date string
  status: string;
}

export async function getTasks(): Promise<TaskSummary[]> {
  const res = await fetch(`${BASE_URL}/api/tasks`);
  if (!res.ok) {
    throw new Error(`Failed to get tasks: ${await res.text()}`);
  }
  return res.json();
}

export interface SalesByCarModel {
  car_model: string;
  total_sales: number;
}

export interface TimeSeriesData {
  year: number;
  count: number;
}

export interface AggregatedData {
  sales_by_car_model: SalesByCarModel[];
  time_series: TimeSeriesData[];
}

export async function getAggregatedData(taskId: number | null): Promise<AggregatedData> {
  const res = await fetch(`${BASE_URL}/api/tasks/${taskId}/aggregated`);
  if (!res.ok) {
    throw new Error(`Failed to get aggregated data: ${await res.text()}`);
  }
  return res.json();
}

export interface RawRecord {
  id: number;
  task_id: number;
  dealer: string;
  sale_date: string;      // Format: YYYY-MM-DD
  car_model: string;
  sales_amount: number;
  color: string;
  engine_capacity: string;
  model_year: number;
  horsepower: number;
  type: string;
}

export interface RawFilters {
  dealer?: string;
  sale_date?: string;      // YYYY-MM-DD (exact match)
  car_model?: string;      // partial match, case-insensitive
  sales_amount?: number | string;
  color?: string;
  engine_capacity?: string;
  model_year?: number | string;
  horsepower?: number | string;
  type?: string;
  sort_by?: string;        // e.g. "sale_date", "sales_amount", etc.
  order?: 'asc' | 'desc';
}

export async function getRawTaskData(
  taskId: number | null,
  filters: RawFilters = {}
): Promise<RawRecord[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  }
  const res = await fetch(`${BASE_URL}/api/tasks/${taskId}/raw?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to get raw task data: ${await res.text()}`);
  }
  return res.json();
}
