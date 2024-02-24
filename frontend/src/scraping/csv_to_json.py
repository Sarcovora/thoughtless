import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    # Open the CSV file
    with open(csv_file_path, 'r') as csv_file:
        # Read the CSV data
        csv_data = csv.DictReader(csv_file)
        # Convert CSV to a list of dictionaries
        data = list(csv_data)

    # Write the JSON data
    with open(json_file_path, 'w') as json_file:
        json.dump(data, json_file, indent=4)

# Specify the file paths
csv_file_path = 'responses.csv'
json_file_path = 'responses.json'

# Convert CSV to JSON
csv_to_json(csv_file_path, json_file_path)
