# Name: Lisette van Nieuwkerk
# Student number: 10590919
"""
Convert csv with data to json file
"""

import pandas as pd
import csv
from contextlib import closing


INPUT_FILE = 'betterlifeindex.csv'
OUTPUT_JSON = 'data.json'

if __name__ == "__main__":
    # Read csv into dataframe
    df = pd.read_csv(INPUT_FILE)

    # Set country's as index and write json file
    df = df.set_index(['LOCATION'])
    output = df.to_json(orient='index')
    with open(OUTPUT_JSON, 'w') as j:
        j.write(output)
