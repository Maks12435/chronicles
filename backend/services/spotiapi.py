import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from datetime import datetime
from babel.dates import format_date

today = datetime.today()
formatted = today.strftime('%Y-%m-%d')

CLIENT_ID = "f346c618c8624f6791f35db57be1951a"
CLIENT_SECRET = "e6feda1ca95449b4a22f246e571206ac"

auth_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
sp = spotipy.Spotify(auth_manager=auth_manager)

def find_music(track: str):
    query = sp.search(q=track, type="track", limit=1)
    items = query.get('tracks', {}).get('items', [])

    if not items:
        return {'error': 'Track not found'}

    result = items[0]

    artist_info = result.get('artists', [{}])[0]
    artist_id = artist_info.get('id', '')
    artist_name = artist_info.get('name', 'Unknown Artist')

    artist = sp.artist(artist_id) if artist_id else {'genres': []}

    album = result.get('album', {})
    album_name = album.get('name', 'Unknown Album')
    album_artists = album.get('artists', [{}])
    image_url = album.get('images', [{}])[0].get('url', '')

    genres = artist.get('genres', [])
    genre = genres[0] if genres else 'Unknown Genre'

    duration_ms = result.get('duration_ms', 0)
    duration = f"{duration_ms // 60000}:{(duration_ms // 1000) % 60:02d}"

    return {
        'title': result.get('name', 'Unknown Title'),
        'artist': artist_name,
        'album': album_name,
        'genre': genre,
        'date': formatted,
        'duration': duration,
        'image': image_url,
    }


