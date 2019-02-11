#!/usr/bin/env python
# Name: Lisette van Nieuwkerk
# Student number: 10590919
"""
This script visualizes data obtained from a .csv file
"""


import matplotlib.pyplot as plt; plt.rcdefaults()
import csv
import matplotlib.pyplot as plt
from statistics import mean
import numpy as np

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

if __name__ == "__main__":
    with open(INPUT_CSV, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data_dict[row['Year']].append(float(row['Rating']))
    for key in range(START_YEAR, END_YEAR):
        list = data_dict[str(key)]
        av = round(mean(list), 1)
        data_dict[str(key)] = av
    print(data_dict)

years = [*data_dict]
rating = [data_dict[x] for x in years]

plt.xlabel('Year')
plt.ylabel('Rating')
plt.title('Rating top 50 movies')
plt.bar(data_dict.keys(), data_dict.values(), align='center', alpha=1)
plt.ylim(8.0, 9.0)
plt.show()
