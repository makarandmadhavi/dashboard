from models import db, Task, Record
from source import load_source_a, load_source_b
from datetime import datetime
import time

def process_task(app, task_id, from_date, to_date, source_a, source_b, car_models_filter, socketio):
    """
    Process a task by loading records from external sources based on the date range
    and car_models filter (if provided), inserting them into the database, and updating
    the task status. Emits SocketIO events for status updates.
    """
    with app.app_context():
        # Retrieve the task and update its status to "in progress"
        task = Task.query.get(task_id)
        if not task:
            return
        task.status = 'in progress'
        db.session.commit()
        socketio.emit('task_update', {"id": task.id, "status": task.status})

        # Simulate processing delay (e.g., 20 seconds)
        time.sleep(20)

        records_to_insert = []
        if source_a:
            data_a = load_source_a("data/source_a.json")
            for rec in data_a:
                if rec['sale_date'] >= from_date and rec['sale_date'] <= to_date:
                    if car_models_filter and rec.get('car_model') not in car_models_filter:
                        continue
                    record = Record(
                        task_id=task_id,
                        dealer="Prime Auto Sales",
                        sale_date=rec['sale_date'],
                        car_model=rec.get('car_model'),
                        sales_amount=rec.get('sales_amount'),
                        color=rec.get('color'),
                        engine_capacity=rec.get('engine_capacity'),
                        model_year=rec.get('model_year'),
                        horsepower=rec.get('horsepower'),
                        type=rec.get('type')
                    )
                    records_to_insert.append(record)
        if source_b:
            data_b = load_source_b("data/source_b.csv")
            for rec in data_b:
                if rec['sale_date'] >= from_date and rec['sale_date'] <= to_date:
                    if car_models_filter and rec.get('car_model') not in car_models_filter:
                        continue
                    record = Record(
                        task_id=task_id,
                        dealer="Metro Motors",
                        sale_date=rec['sale_date'],
                        car_model=rec.get('car_model'),
                        sales_amount=rec.get('sales_amount'),
                        color=rec.get('color'),
                        engine_capacity=rec.get('engine_capacity'),
                        model_year=rec.get('model_year'),
                        horsepower=rec.get('horsepower'),
                        type=rec.get('type')
                    )
                    records_to_insert.append(record)

        db.session.add_all(records_to_insert)
        task.status = 'completed'
        db.session.commit()
        socketio.emit('task_update', {"id": task.id, "status": task.status})
