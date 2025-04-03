import json
import random
from datetime import datetime, timedelta

# Define the date range for sale_date: January 1, 2020 to March 31, 2025
start_date = datetime(2020, 1, 1)
end_date = datetime(2025, 3, 31)
date_range_days = (end_date - start_date).days

# Define sample options for the records
car_models = [
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
    'Audi A6'
]
colors = ["Red", "Blue", "Black", "White", "Silver", "Gray", "Green"]
engine_capacities = ["2.0L", "2.5L", "3.0L", "3.5L"]
model_years = [2020, 2021, 2022, 2023, 2024, 2025]
types = ["SUV", "Standard Sedan", "Intermediate Sedan", "Premium", "Sports"]

num_records = 10000  # Generate 5,000 records
records = []

for i in range(num_records):
    # Generate a random sale_date within the specified range
    random_days = random.randint(0, date_range_days)
    sale_date = (start_date + timedelta(days=random_days)).strftime('%Y-%m-%d')
    
    record = {
        "sale_date": sale_date,
        "car_model": random.choice(car_models),
        "sales_amount": random.randint(15000, 60000),
        "dealer": "Dealer A",
        "color": random.choice(colors),
        "engine_capacity": random.choice(engine_capacities),
        "model_year": random.choice(model_years),
        "horsepower": random.randint(150, 400),
        "type": random.choice(types)
    }
    records.append(record)

# Write the records to a JSON file
with open("source_a.json", "w") as f:
    json.dump(records, f, indent=2)

print(f"source_a.json created with {num_records} records.")
