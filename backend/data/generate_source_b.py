import csv
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

# CSV header fields
header = [
    "sale_date",
    "car_model",
    "sales_amount",
    "dealer",
    "color",
    "engine_capacity",
    "model_year",
    "horsepower",
    "type"
]

records = []
num_records = 10000  # Generate at least 5000 records

for i in range(num_records):
    # Generate a random sale_date within the given range
    random_days = random.randint(0, date_range_days)
    sale_date = (start_date + timedelta(days=random_days)).strftime('%Y-%m-%d')
    
    car_model = random.choice(car_models)
    # Generate sales amount randomly between 15,000 and 60,000
    sales_amount = random.randint(15000, 60000)
    dealer = "Dealer B"
    color = random.choice(colors)
    engine_capacity = random.choice(engine_capacities)
    model_year = random.choice(model_years)
    # Generate horsepower randomly between 150 and 400
    horsepower = random.randint(150, 400)
    record_type = random.choice(types)
    
    record = [
        sale_date,
        car_model,
        sales_amount,
        dealer,
        color,
        engine_capacity,
        model_year,
        horsepower,
        record_type
    ]
    records.append(record)

# Write the records to a CSV file
with open("source_b.csv", "w", newline="") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(header)
    writer.writerows(records)

print(f"source_b.csv created with {num_records} records.")
