
#!/usr/bin/env python
# Name: Lisette van Nieuwkerk
# Student number: 10590919
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'

def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # Set list of movies
    movies = []

    # For every movie in the IMBD list
    for movie in dom.find_all(class_='lister-item-content'):
        # Find title
        title = movie.find(href=re.compile("title")).get_text()

        # Find rating
        rating = movie.find(class_="inline-block ratings-imdb-rating")
        rating = rating.strong.get_text()

        # Find year and remove characters other than number
        year = movie.find(class_='lister-item-year text-muted unbold').get_text()
        year = re.sub('\D', '', year)

        # Find all actors and seperate by comma's
        actors = movie.find_all(href=re.compile("adv_li_st"))
        list_actors = ", ".join([(actor.get_text()) for actor in actors])

        # Find runtime and remove characters other than number
        runtime = movie.find(class_='runtime').get_text()
        runtime = re.sub('\D', '', runtime)

        # Add movie to list
        movies.append([title, rating, year, list_actors, runtime])

    return movies


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """

    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # Write every movie in one line of csv file
    writer.writerows(movies)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a ;DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)
    
    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
