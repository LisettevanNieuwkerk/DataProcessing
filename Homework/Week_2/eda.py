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

INPUT_FILE = 'input.csv'
OUTPUT_CSV = 'output.csv'



if __name__ == "__main__":
    with open(INPUT_FILE, 'r', newline='') as input:
        with open(OUTPUT_CSV, 'w', newline='') as outfile:
            writer = csv.writer(outfile)
            writer.writerows([input])



    reader = pd.read_csv(INPUT_FILE)
    print(reader)



        #data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}


            #['Country', 'Region', 'Population', 'Area (sq. mi.)', 'Pop. Density (per sq. mi.)',
            #'Coastline (coast/area ratio)', 'Net migration', 'Infant mortality (per 1000 births)',
            #'GDP ($ per capita) dollars', 'Literacy (%)', 'Phones (per 1000)', 'Arable (%)', 'Crops (%)', 'Other (%)', 'Climate',
            #'Birthrate', 'Deathrate', 'Agriculture', 'Industry', 'Service'])
