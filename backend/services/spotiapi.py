import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from datetime import date, datetime
from babel.dates import format_date

today = date.today()
formatted = date(today.year, today.month, today.day)

CLIENT_ID = "f346c618c8624f6791f35db57be1951a"
CLIENT_SECRET = "e6feda1ca95449b4a22f246e571206ac"

auth_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
sp = spotipy.Spotify(auth_manager=auth_manager)

def find_music(track: str):
    if not track:
        return None
    
    query = sp.search(q=track, type="track", limit=1)
    items = query.get('tracks', {}).get('items', [])

    if not items:
        return None

    result = items[0]

    artist_info = result.get('artists', [{}])[0]
    artist_id = artist_info.get('id', '')
    artist_name = artist_info.get('name', 'Unknown Artist')

    artist = sp.artist(artist_id) if artist_id else {'genres': []}

    album = result.get('album', {})
    album_name = album.get('name', 'Unknown Album')
    album_artists = album.get('artists', [{}])
    small_image_url = album.get('images', [{}])[2].get('url', '')
    mid_image_url = album.get('images', [{}])[1].get('url', '')
    big_image_url = album.get('images', [{}])[0].get('url', '')

    genres = artist.get('genres', [])
    genre = genres[0] if genres else 'Unknown Genre'

    duration_ms = result.get('duration_ms', 0)
    duration = f"{duration_ms // 60000}:{(duration_ms // 1000) % 60:02d}"

    return {
        'id': result.get('id'),
        'title': result.get('name', 'Unknown Title'),
        'artist': artist_name,
        'album': album_name,
        'genre': genre,
        'date': formatted,
        'duration': duration,
        'small_image': small_image_url,
        'mid_image': mid_image_url,
		'big_image': big_image_url,
    }
    


def find_artist(artist_name: str):
    query = sp.search(q=artist_name, type="artist", limit=1)
    items = query.get('artists', {}).get('items', [])

    if not items:
        return {'error': 'Artist not found'}

    artist = items[0]

    name = artist.get('name', 'Unknown Artist')
    genres = artist.get('genres', [])
    genre = genres[0] if genres else 'Unknown Genre'
    small_image_url = artist.get('images', [{}])[2].get('url', '')
    mid_image_url = artist.get('images', [{}])[1].get('url', '')
    big_image_url = artist.get('images', [{}])[0].get('url', '')
    followers = artist.get('followers', {}).get('total', 0)
    popularity = artist.get('popularity', 0)

    return {
        'name': name,
        'genre': genre,
        'small_image': small_image_url,
        'mid_image': mid_image_url,
		'big_image': big_image_url,
        'followers': followers,
        'popularity': popularity,
    }


