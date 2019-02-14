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
    # Write csv correct
    #file = []
    #with open(INPUT_FILE, 'r', newline='') as input:
    #    for line in input:
    #        print(line)


            #if field != ['-']:
            #    if field[2].isdigit():
            #        field.remove(field[2])
            #    file.append(field

    #with open(OUTPUT_CSV, 'w', newline='') as outfile:
    #    writer = csv.writer(outfile)
    #    writer.writerow(file[0])
    #    writer.writerows(file[1:])

    df = pd.read_csv(INPUT_FILE)
    print(df)

    with open(OUTPUT_CSV, 'w', newline='') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(df)
    print(OUTPUT_CSV)    
    #    writer.writerows(file[1:])






            #['Country', 'Region', 'Population', 'Area (sq. mi.)', 'Pop. Density (per sq. mi.)',
            #'Coastline (coast/area ratio)', 'Net migration', 'Infant mortality (per 1000 births)',
            #'GDP ($ per capita) dollars', 'Literacy (%)', 'Phones (per 1000)', 'Arable (%)', 'Crops (%)', 'Other (%)', 'Climate',
            #'Birthrate', 'Deathrate', 'Agriculture', 'Industry', 'Service'])
