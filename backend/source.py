import json
import csv
from datetime import datetime

def load_source_a(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
    # Convert sale_date string to a date object
    for record in data:
        record['sale_date'] = datetime.strptime(record['sale_date'], '%Y-%m-%d').date()
    return data

def load_source_b(filename):
    records = []
    with open(filename, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            row['sale_date'] = datetime.strptime(row['sale_date'], '%Y-%m-%d').date()
            row['sales_amount'] = float(row['sales_amount'])
            # Other fields remain as strings or can be converted as needed.
            records.append(row)
    return records
