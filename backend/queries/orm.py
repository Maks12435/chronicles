from sqlalchemy import select, func, case, cast, String, distinct, Numeric
from db import session_factory
from models import MovieTable, Tracks, TracksTable, FootballTable, TeamsTable
from sqlalchemy.orm import aliased

def select_tracks():
    with session_factory() as session:
        query = (
            select(TracksTable).order_by(TracksTable.rank.asc())
        )

        result = session.execute(query).scalars().all()

        return [row for row in result]

def delete_track(track_id):
    with session_factory() as session:
        track = session.get(TracksTable, track_id)
        if track:
            session.delete(track)
            session.commit()
            return {"message": "Track deleted"}
        else:
            return {"error": "Track not found"}
        
def select_genres():
    with session_factory() as session:
        query = (
            select(TracksTable.genre, func.count().label('genres_count'))
            .group_by(TracksTable.genre)
        )
        results = session.execute(query).all()

        return [{"genre": genre, "count": count} for genre, count in results]
    
def select_artists():
    with session_factory() as session:
        query = (
            select(TracksTable.artist, func.count().label('artists_count'))
            .group_by(TracksTable.artist)
        )
        results = session.execute(query).all()

        return [{"artist": artist, "count": count} for artist, count in results]

def get_next_rank():
    with session_factory() as session:
        used_ranks = session.query(TracksTable.rank).filter(TracksTable.rank != None).all()
        used = {r[0] for r in used_ranks}
        for i in range(1, 21):
            if i not in used:
                return i
        return None 
    
def insert_track(track):
    with session_factory() as session:
        track_data = track.dict()
        track_data["rank"] = get_next_rank()

        session.add(TracksTable(**track_data))
        session.commit()

def swap_with_next_rank(track_id):
    with session_factory() as session:
        current = session.query(TracksTable).get(track_id)
        if not current or current.rank is None:
            raise ValueError("Track not found or has no rank")

        current_rank = current.rank

        next_track = (
            session.query(TracksTable)
            .filter(TracksTable.rank < current_rank)
            .order_by(TracksTable.rank.desc())
            .first()
        )

        if not next_track:
            raise ValueError("No track with higher rank to swap with")

        current.rank, next_track.rank = next_track.rank, current_rank

        session.commit()




def select_matches():
    with session_factory() as session:
        Team1 = aliased(TeamsTable)
        Team2 = aliased(TeamsTable)

        query = (
            select(FootballTable, Team1, Team2)
            .join(Team1, FootballTable.team1 == Team1.id)
            .join(Team2, FootballTable.team2 == Team2.id)
        )

        result = session.execute(query).all()

        return [
            {
                "id": match.id,
                "score": match.score,
                "date": match.date,
                "stadium": match.stadium,
                "tournament": match.tournament,
                "image": match.image,
                "stage": match.stage,
                "team1": {
                    "name": team1.name,
                    "logo": team1.logo
                },
                "team2": {
                    "name": team2.name,
                    "logo": team2.logo
                }
            }
            for match, team1, team2 in result
        ]


def select_movies():
    with session_factory() as session:
        query = select(MovieTable)
        result = session.execute(query)
        movies = result.scalars().all()

        return [movie for movie in movies]

def insert_movie(movie):
    with session_factory() as session:
        track_data = movie.dict()

        session.add(MovieTable(**track_data))
        session.commit()

def delete_movie(movie_id):
    with session_factory() as session:
        movie = session.get(MovieTable, movie_id)
        if movie:
            session.delete(movie)
            session.commit()
            return {"message": "movie deleted"}
        else:
            return {"error": "movie not found"}