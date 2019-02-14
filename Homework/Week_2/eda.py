# Name: Lisette van Nieuwkerk
# Student number: 10590919
"""
This script
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

INPUT_CSV = "input.csv"


if __name__ == "__main__":
    with open(INPUT_CSV, newline='') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            print(row)
