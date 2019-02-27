# Name: Lisette van Nieuwkerk
# Student number: 10590919
"""
Convert csv with data to json file
"""

import pandas as pd
import csv
from contextlib import closing
from numpy import percentile
import matplotlib.pyplot as plt


INPUT_FILE = 'air.csv'
OUTPUT_JSON = 'output.json'

if __name__ == "__main__":
    # Read csv into dataframe
    df = pd.read_csv(INPUT_FILE)

    # Filter columns
    columns = ['Country', 'Variable', 'YEA', 'Unit', 'Value']
    df = df.filter(items=columns)

    # Select rows with variable
    df = df.loc[df['Variable'] == 'Mortality from exposure to outdoor PM2.5 and ozone']

    # Set country's as index and write json file
    df = df.set_index(['YEA'])
    output = df.to_json(orient='index')
    with open(OUTPUT_JSON, 'w') as j:
        j.write(output)
