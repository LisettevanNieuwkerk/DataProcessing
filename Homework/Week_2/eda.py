# Name: Lisette van Nieuwkerk
# Student number: 10590919
"""
This script loads data into a dataframe, cleans and preproces the dataframe,
visualizes the data and writes it to a json file.
"""

import pandas as pd
import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from numpy import percentile


import matplotlib.pyplot as plt


INPUT_FILE = 'input_(1).csv'
OUTPUT_CSV = 'output.csv'
OUTPUT_JSON = 'output.json'


if __name__ == "__main__":
    # Read csv into dataframe
    df = pd.read_csv(INPUT_FILE)

    # Filter columns
    columns = ['Country', 'Region', 'Pop. Density (per sq. mi.)',
    'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars']
    df = df.filter(items=columns)

    # Save dataframe to csv
    with open(OUTPUT_CSV, newline='') as c:
        df.to_csv(OUTPUT_CSV, index=False)

    # Remove rows with unkown or nan values
    value = (df.iat[10,2])
    df = df.mask(df == value)
    df = df.dropna()

    # Change numeric values to ints or floats
    df[(columns[4])] = (df[(columns[4])].str.extract('(\d+)', expand=False)).astype(int)
    df[(columns[3])] = (df[(columns[3])].replace(',', '.', regex=True)).astype(float)

    # Remove irregular max value
    df = df.loc[df[(columns[4])]!= df[(columns[4])].max()]

    # Calculate median, mode, mean of GDP
    median = df[(columns[4])].median()
    mode = df[(columns[4])].mode()
    mean = df[(columns[4])].mean()
    print(median, mode, mean)
    print(df)

    # Plot histogram of GDP
    plt.figure();
    df[(columns[4])].plot.hist(stacked=True, bins=40, alpha=1, grid=True)
    plt.xlabel('GDP')
    plt.title('GDP ($ per capita) dollars in countries')
    plt.axis([0, 57500, 0, 60])

    # Five Number Summary of infant mortality
    quartiles = percentile(df[(columns[3])], [25, 50, 75])
    mini, maxi = df[(columns[3])].min(), df[(columns[3])].max()
    print(quartiles)
    print(mini, maxi)

    # Boxplot of infant mortality
    plt.figure();
    df.boxplot(column=['Infant mortality (per 1000 births)'],
                       grid=True)
    plt.ylabel('Deaths')
    plt.ylim(bottom=0)
    plt.show()

    # Set country's as index and write json file
    df = df.set_index(['Country'])
    output = df.to_json(orient='index')
    with open(OUTPUT_JSON, 'w') as j:
        j.write(output)
