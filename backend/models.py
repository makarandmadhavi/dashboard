from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=True)  # Optional custom name
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), nullable=False, default='pending')
    
    # Relationship: One Task can have many Records
    records = db.relationship('Record', backref='task', lazy=True)

    def __repr__(self):
        return f'<Task {self.id} - {self.name}>'

class Record(db.Model):
    __tablename__ = 'records'
    
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    dealer = db.Column(db.String(50), nullable=False)  # "Prime Auto Sales" or "Metro Motors"
    sale_date = db.Column(db.Date, nullable=True)        # Date of the record
    car_model = db.Column(db.String(100), nullable=True)
    sales_amount = db.Column(db.Float, nullable=True)      # e.g., sale amount
    color = db.Column(db.String(50), nullable=True)
    engine_capacity = db.Column(db.String(20), nullable=True)
    model_year = db.Column(db.Integer, nullable=True)
    horsepower = db.Column(db.Integer, nullable=True)
    type = db.Column(db.String(50), nullable=True)

    def __repr__(self):
        # If your Python version supports f-strings (>=3.6)
        return f'<Record {self.id} - Task {self.task_id} - {self.car_model}>'
