
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
    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED MOVIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
    # Get list of movies
    movies = []
    for movie in dom.find_all(class_='lister-item-content'):
        # Get title
        title = movie.find(href=re.compile("title")).get_text()
        movies.append(title)

        # Rating
        rating = movie.find(class_="inline-block ratings-imdb-rating")
        rating = rating.strong.get_text()
        movies.append(rating)

        # Get year
        year = movie.find(class_='lister-item-year text-muted unbold').get_text()
        year = re.sub('\D', '', year)
        movies.append(year)

        # Get actors
        actors = movie.find_all(href=re.compile("adv_li_st"))
        list_actors = []
        for actor in actors:
            list_actors.append(actor.get_text())
        list_actors = ", ".join([str(x) for x in list_actors])
        movies.append(list_actors)

        # Get runtime
        runtime = movie.find(class_='runtime').get_text()
        runtime = re.sub('\D', '', runtime)
        movies.append(runtime)

    print(movies)
    return movies   # REPLACE THIS LINE AS WELL IF APPROPRIAT


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    t = 0
    r = 5
    categories = 5
    amount = int(len(movies)/categories)
    writer = csv.writer(outfile)

    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    for movie in range(amount):
        writer.writerow(movies[t:r])
        t += 5
        r += 5


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
