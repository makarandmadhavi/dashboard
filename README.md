# Visual Dashboard Project

This project is a full-stack web application that provides a visual dashboard for managing and analyzing tasks related to sales data. The dashboard allows users to create tasks, filter and process external data from different sources, and view aggregated analytics in an interactive and visually appealing interface.

## Table of Contents

- [Visual Dashboard Project](#visual-dashboard-project)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Technologies](#technologies)
  - [Features](#features)
    - [Task Creation \& Job Queue](#task-creation--job-queue)
    - [Data Aggregation \& Visualization](#data-aggregation--visualization)
    - [Raw Data Table](#raw-data-table)
  - [Project Structure](#project-structure)
  - [Setup \& Installation](#setup--installation)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Usage](#usage)
  - [Future Enhancements](#future-enhancements)
  - [License](#license)

## Overview

This project aims to demonstrate how to build a modern, responsive dashboard application using Next.js, TypeScript, Tailwind CSS, Material‑UI, and D3.js on the frontend, along with a Flask backend using SQLite and SQLAlchemy. The dashboard enables users to create tasks with filtering parameters for retrieving external data, simulate task processing via a job queue, and visualize aggregated analytics through interactive charts and cards.

## Technologies

- **Frontend:**
  - [Next.js](https://nextjs.org/) (with App Router)
  - TypeScript
  - Tailwind CSS
  - Material‑UI
  - D3.js for data visualization
- **Backend:**
  - Flask
  - SQLite
  - SQLAlchemy
  - Flask-Migrate

## Features

### Task Creation & Job Queue
- **Create Task Page:**  
  Users can create a new task by entering a task name, selecting a date range (with preset options), choosing external data sources, and filtering by car models.
- **Job Queue Simulation:**  
  When a task is submitted, it enters a job queue where its status changes from "pending" to "in progress" and finally "completed" after simulated processing delays. (Note: This is mocked for now.)

### Data Aggregation & Visualization
- **Aggregated Analytics Page:**  
  - **Filters Panel:**  
    A shared, collapsible filters component at the top of the page dynamically populates options (e.g., dealer, car model, model year) based on the raw data. The same filters are applied to both charts and the raw data table.
  - **Interactive Charts:**  
    Two D3.js-powered charts display aggregated data:
    - **Interactive Line Chart:** Shows a time series (number of records per year).
    - **Interactive Bar Chart:** Displays the count of cars sold by each model (x-axis tickers are removed for a cleaner look).
  - **Aggregated Cards (Optional):**  
    A component (built with Material‑UI and Tailwind CSS) displays key summary metrics such as Total Sales and a scrollable list of Cars Sold by Model.

### Raw Data Table
- A fixed-layout table displays the filtered raw data with pagination and sorting controls. The table columns have a constant width, and row heights are fixed for consistency.

## Project Structure

A sample project structure might look like this:

```
/project-root
  ├── /app
  │    ├── /dashboard
  │    │    ├── /components
  │    │    │    ├── AggregatedCards.tsx
  │    │    │    ├── FiltersPanel.tsx
  │    │    │    ├── InteractiveBarChart.tsx
  │    │    │    ├── InteractiveLineChart.tsx
  │    │    │    └── RawDataTable.tsx
  │    │    └── AnalyticsPage.tsx
  │    └── /lib
  │         └── api.ts
  ├── /backend
  │    ├── app.py
  │    ├── models.py
  │    ├── process.py
  │    └── ... (other backend files)
  ├── package.json
  ├── tailwind.config.js
  └── README.md
```

## Setup & Installation

### Frontend

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/visual-dashboard.git
   cd visual-dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   The frontend will be available at [http://localhost:3000](http://localhost:3000).

### Backend

1. **Navigate to the backend folder:**

   ```bash
   cd backend
   ```

2. **Create a virtual environment and activate it:**

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install required packages:**

   ```bash
   pip install flask flask_sqlalchemy flask_migrate
   ```

4. **Run the backend server:**

   ```bash
   flask run
   ```

   The backend API will be available at [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Usage

1. **Create Task:**  
   Use the Create Task page to submit a task with filtering options for external data sources.

2. **View Analytics:**  
   After task processing is complete, navigate to the Analytics page to:
   - Select a task from the dropdown.
   - Use the shared filters panel to filter raw data.
   - View interactive charts that display aggregated data (time series and cars sold by model).
   - See a detailed raw data table.

3. **Aggregated Cards:**  
   Optionally, the AggregatedCards component can be rendered to show summary metrics like Total Sales and a scrollable list of Cars Sold by Model.

## Future Enhancements

- **Backend API Improvements:**  
  Integrate real data fetching from external sources and implement a persistent job queue.
- **Real-Time Updates:**  
  Implement Server-Sent Events (SSE) or WebSockets for real-time dashboard updates.
- **Additional Visualizations:**  
  Add more interactive charts and drill-down features.
- **User Authentication:**  
  Implement user authentication and task ownership.

## License

This project is licensed under the MIT License.
