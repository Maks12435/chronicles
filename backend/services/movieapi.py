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
        return None

    
def find_tv_show(tv_name: str, season: int = None):
    search_url = 'https://api.themoviedb.org/3/search/tv'
    params = {
        'api_key': API_KEY,
        'query': tv_name,
        'language': LANG
    }

    response = requests.get(search_url, params=params)
    data = response.json()

    if data['results']:
        first_show = data['results'][0]
        tv_id = first_show['id']

        details_url = f'https://api.themoviedb.org/3/tv/{tv_id}'
        details_params = {
            'api_key': API_KEY,
            'language': LANG
        }
        details_response = requests.get(details_url, params=details_params).json()

        default_season_number = 1
        if details_response.get('number_of_seasons', 0) == 0:
            season_data = None
        else:
            season_number = season if season is not None else default_season_number
            season_url = f'https://api.themoviedb.org/3/tv/{tv_id}/season/{season_number}'
            season_params = {
                'api_key': API_KEY,
                'language': LANG
            }
            season_response = requests.get(season_url, params=season_params)
            season_data = season_response.json() if season_response.status_code == 200 else None

        return {
            'title': details_response.get('name'),
            'original_title': details_response.get('original_name'),
            'tagline': None,  
            'genre': (
                details_response['genres'][0]['name']
                if details_response.get('genres') and len(details_response['genres']) > 0
                else 'Unknown'
            ),
            'description': details_response.get('overview'),
            'release_date': details_response.get('first_air_date'),
            'country': (
                details_response['origin_country'][0]
                if details_response.get('origin_country') and len(details_response['origin_country']) > 0
                else 'N/A'
            ),
            'rating': details_response.get('vote_average'),
            'personal_rating': None,
            'image': (
                details_response.get('poster_path')
                if details_response.get('poster_path')
                else None
            ),
            'season_number': season_data.get('season_number') if season_data else None,
            'episodes_count': len(season_data['episodes']) if season_data and 'episodes' in season_data else 0,
            'season_overview': season_data.get('overview') if season_data else None,
            'season_poster': season_data.get('poster_path') if season_data else None,
        }
    else:
        return None
