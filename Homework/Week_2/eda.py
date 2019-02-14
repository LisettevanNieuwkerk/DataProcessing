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

INPUT_FILE = 'input.csv'
OUTPUT_CSV = 'output.csv'



if __name__ == "__main__":
    with open(OUTPUT_CSV, 'w', newline='') as outfile:
        with open(INPUT_FILE, 'r', newline='') as input:
            for line in input:
                fields = line.replace('"', '')
                fields = fields.replace('  ', '')
                field = fields.split(',')
                if field[0] != '\r\n':
                    writer = csv.writer(outfile)
                    writer.writerow(field)




#reader = pd.read_csv(INPUT_FILE)
#print(reader)

            #['Country', 'Region', 'Population', 'Area (sq. mi.)', 'Pop. Density (per sq. mi.)',
            #'Coastline (coast/area ratio)', 'Net migration', 'Infant mortality (per 1000 births)',
            #'GDP ($ per capita) dollars', 'Literacy (%)', 'Phones (per 1000)', 'Arable (%)', 'Crops (%)', 'Other (%)', 'Climate',
            #'Birthrate', 'Deathrate', 'Agriculture', 'Industry', 'Service'])
