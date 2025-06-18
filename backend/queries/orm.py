from sqlalchemy import select, func, case, cast, String, distinct, Numeric
from db import session_factory
from models import Tracks, TracksTable

def select_tracks():
    with session_factory() as session:
        query = (
            select(TracksTable).order_by(TracksTable.rank.desc())
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
            .filter(TracksTable.rank > current_rank)
            .order_by(TracksTable.rank.asc())
            .first()
        )

        if not next_track:
            raise ValueError("No track with higher rank to swap with")

        temp_rank = -1

        current.rank = temp_rank
        session.flush()  

        current.rank = next_track.rank
        next_track.rank = current_rank

        session.commit()

