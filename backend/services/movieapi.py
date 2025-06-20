import requests

API_KEY = '1223c381cc298c952a8eab3c719fd127'  
LANG = 'ru-RU'  

def find_movie(movie_name: str):
    search_url = 'https://api.themoviedb.org/3/search/movie'
    params = {
        'api_key': API_KEY,
        'query': movie_name,
        'language': LANG
    }

    response = requests.get(search_url, params=params)
    data = response.json()

    if data['results']:
        first_movie = data['results'][0]       
        movie_id = first_movie['id'] 

        details_url = f'https://api.themoviedb.org/3/movie/{movie_id}'
        details_params = {
            'api_key': API_KEY,
            'language': LANG
        }
        details_response = requests.get(details_url, params=details_params).json()

        return {
            'title': details_response.get('title'),
            'original_title': details_response.get('original_title'),
            'tagline': details_response.get('tagline'),
            'genre': (
                details_response['genres'][0]['name']
                if details_response.get('genres') and len(details_response['genres']) > 0
                else 'Unknown'
            ),
            'description': details_response.get('overview'),
            'release_date': details_response.get('release_date'),
            'country': (
                details_response['production_countries'][0]['iso_3166_1']
                if details_response.get('production_countries') and len(details_response['production_countries']) > 0
                else 'N/A'
            ),
            'rating': details_response.get('vote_average'),
            'personal_rating': None,
            'image': (
                details_response.get('poster_path')
                if details_response.get('poster_path')
                else None
            ),
        }


    else:
        return {'error': 'Фильм не найден'}
