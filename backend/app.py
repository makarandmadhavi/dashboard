from flask import Flask, jsonify, request
from models import db, Task, Record
from datetime import datetime
import threading, time
from flask_migrate import Migrate
from process import process_task  # This function is now updated to emit events
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sales.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
with app.app_context():
    db.create_all()
migrate = Migrate(app, db)

# Initialize SocketIO with CORS allowed (or restrict origins as needed)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return jsonify({"health": "ok"})

# Create a new task endpoint
@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400

    name = data.get("name")
    from_date_str = data.get("from_date")
    to_date_str = data.get("to_date")
    # Note: Use keys as defined in your frontend payload
    source_a = data.get("PrimeAutoSales", False)
    source_b = data.get("MetroMotors", False)
    car_models_filter = data.get("car_models", [])

    if not from_date_str or not to_date_str:
        return jsonify({"error": "from_date and to_date are required"}), 400
    try:
        from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
        to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    # Create a new task with status 'pending'
    new_task = Task(name=name, status='pending')
    db.session.add(new_task)
    db.session.commit()

    # Enqueue job processing in a background thread
    threading.Thread(
        target=process_task,
        args=(app, new_task.id, from_date, to_date, source_a, source_b, car_models_filter, socketio)
    ).start()

    return jsonify({"message": "Task created", "task_id": new_task.id}), 201

# Get list of all tasks (for job queue status)
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    result = []
    for task in tasks:
        result.append({
            "id": task.id,
            "name": task.name,
            "created_at": task.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "status": task.status
        })
    return jsonify(result)

# Get aggregated data for visualization for a given task
@app.route('/api/tasks/<int:task_id>/aggregated', methods=['GET'])
def aggregated_data(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    if task.status != 'completed':
        return jsonify({"error": "Task not completed yet"}), 400

    records = Record.query.filter_by(task_id=task_id).all()

    # Aggregation 1: Time series count per year
    time_series = {}
    for rec in records:
        if rec.sale_date:
            year = rec.sale_date.year
            time_series[year] = time_series.get(year, 0) + 1
    time_series_list = [{"year": year, "count": count} for year, count in sorted(time_series.items())]

    # Aggregation 2: Aggregated sales by car_model
    sales_by_model = {}
    for rec in records:
        if rec.car_model and rec.sales_amount:
            sales_by_model[rec.car_model] = sales_by_model.get(rec.car_model, 0) + rec.sales_amount
    sales_by_model_list = [{"car_model": cm, "total_sales": total} for cm, total in sales_by_model.items()]

    aggregated = {
        "time_series": time_series_list,
        "sales_by_car_model": sales_by_model_list
    }
    return jsonify(aggregated)

# New API Endpoint for Raw Task Data with Filtering & Sorting
@app.route('/api/tasks/<int:task_id>/raw', methods=['GET'])
def raw_task_data(task_id):
    query = Record.query.filter_by(task_id=task_id)
    filterable_columns = [
        "dealer", "sale_date", "car_model", "sales_amount",
        "color", "engine_capacity", "model_year", "horsepower", "type"
    ]
    
    for col in filterable_columns:
        value = request.args.get(col)
        if value:
            if col == "sale_date":
                try:
                    date_val = datetime.strptime(value, '%Y-%m-%d').date()
                    query = query.filter(getattr(Record, col) == date_val)
                except ValueError:
                    return jsonify({"error": f"Invalid date format for {col}. Expected YYYY-MM-DD."}), 400
            elif col in ["sales_amount"]:
                try:
                    num_val = float(value)
                    query = query.filter(getattr(Record, col) == num_val)
                except ValueError:
                    return jsonify({"error": f"Invalid numeric format for {col}."}), 400
            elif col in ["model_year", "horsepower"]:
                try:
                    num_val = int(value)
                    query = query.filter(getattr(Record, col) == num_val)
                except ValueError:
                    return jsonify({"error": f"Invalid numeric format for {col}."}), 400
            else:
                query = query.filter(getattr(Record, col).ilike(f"%{value}%"))
    
    sort_by = request.args.get("sort_by")
    order = request.args.get("order", "asc").lower()
    if sort_by and hasattr(Record, sort_by):
        column_attr = getattr(Record, sort_by)
        if order == "desc":
            query = query.order_by(column_attr.desc())
        else:
            query = query.order_by(column_attr.asc())
    else:
        query = query.order_by(Record.sale_date.asc())
    
    records = query.all()
    result = []
    for rec in records:
        result.append({
            "id": rec.id,
            "task_id": rec.task_id,
            "dealer": rec.dealer,
            "sale_date": rec.sale_date.strftime('%Y-%m-%d') if rec.sale_date else None,
            "car_model": rec.car_model,
            "sales_amount": rec.sales_amount,
            "color": rec.color,
            "engine_capacity": rec.engine_capacity,
            "model_year": rec.model_year,
            "horsepower": rec.horsepower,
            "type": rec.type
        })
    return jsonify(result)

if __name__ == '__main__':
    # Run using SocketIO's run() method
    socketio.run(app, debug=True, threaded=True)
