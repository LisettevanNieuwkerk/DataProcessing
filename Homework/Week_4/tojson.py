# Name: Lisette van Nieuwkerk
# Student number: 10590919
"""
Convert csv with data to json file
"""

import pandas as pd
import csv
from contextlib import closing


INPUT_FILE = 'data.csv'
OUTPUT_JSON = 'output.json'

if __name__ == "__main__":
    # Read csv into dataframe
    df = pd.read_csv(INPUT_FILE)

    # Filter columns
    columns = ['LOCATION', 'MEASURE', 'TIME', 'Value']
    df = df.filter(items=columns)

    # Select rows and drop empty values
    df = df.loc[df['MEASURE'] == 'PC_PRYENRGSUPPLY']
    df = df.loc[df['TIME'] == 2016]
    df = df.loc[df['LOCATION'] != 'OECD']
    df = df.dropna(subset=['Value'])

    # Write json file
    output = df.to_json(orient='values')
    with open(OUTPUT_JSON, 'w') as j:
        j.write(output)
