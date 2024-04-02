import csv
import json
import sys

def csv_to_json(csv_data):
    try:
        # Convert the buffer data to a string
        csv_str = csv_data.decode('utf-8')

        # Split the string into lines and parse CSV
        csv_reader = csv.DictReader(csv_str.splitlines())

        # Convert CSV to a list of dictionaries
        data = list(csv_reader)

        # Serialize the data to JSON format
        json_data = json.dumps(data, indent=4)
        return json_data
    except Exception as e:
        # Return error message if any exception occurs
        return str(e)

if __name__ == "__main__":
    # Read the buffer data from standard input
    csv_data = sys.stdin.buffer.read()

    # Convert CSV to JSON
    json_data = csv_to_json(csv_data)

    # Print the JSON data
    print(json_data)
