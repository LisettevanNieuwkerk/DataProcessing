# Name: Lisette van Nieuwkerk
# Student number: 10590919
"""
This script
"""

import pandas as pd
import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

INPUT_FILE = 'input_(1).csv'
OUTPUT_CSV = 'output.csv'



if __name__ == "__main__":
    df = pd.read_csv(INPUT_FILE)
    items = ['Country', 'Region', 'Pop. Density (per sq. mi.)',
    'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars']
    df = df.filter(items=items)
    df = df.dropna()
    print(df)

    with open(OUTPUT_CSV, 'w', newline='') as outfile:
        df.to_csv(OUTPUT_CSV, index=False)
