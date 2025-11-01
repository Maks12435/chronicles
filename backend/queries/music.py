from uuid import UUID
from fastapi import HTTPException
from sqlalchemy import exists, select, func, desc
from db import session_factory
from models import TracksTable, UserTracksTable


def select_tracks(year: int, user_id: UUID):
    with session_factory() as session:
        query = (
			select(TracksTable, UserTracksTable)
			.join(UserTracksTable, UserTracksTable.track_id == TracksTable.id)
			.where((UserTracksTable.year == year) & (UserTracksTable.user_id == user_id))
			.order_by(UserTracksTable.rank.asc())
		)

        result = session.execute(query).all()

        tracks = []
        for track, user_track in result:
            tracks.append({
                "id": user_track.id,
                "title": track.title,
                "artist": track.artist,
                "album": track.album,
                "genre": track.genre,
                "duration": track.duration,
                "small_image": track.small_image,
                "mid_image": track.mid_image,
                "big_image": track.big_image,
                "rank": user_track.rank,
                "year": user_track.year,
                "addition_date": user_track.addition_date.isoformat() if user_track.addition_date else None
            })

        return tracks


def delete_track(track_id):
    with session_factory() as session:
        track = session.get(UserTracksTable, track_id)
        if track:
            session.delete(track)
            session.commit()
            return {"message": "Track deleted"}
        else:
            return {"error": "Track not found"}

def get_next_rank(year: int, user_id: UUID):
    with session_factory() as session:
        used_ranks = (
            session.query(UserTracksTable.rank)
            .filter(
                UserTracksTable.year == year,
                UserTracksTable.user_id == user_id,
                UserTracksTable.rank != None
            )
            .all()
        )

        used = {r[0] for r in used_ranks}
        for i in range(1, 31):
            if i not in used:
                return i
        raise ValueError("The Top is already overfilled")


def insert_track(track, year, user_id):
    with session_factory() as session:
        track_data = track.dict()

        existing_track = session.execute(
            select(TracksTable).where(TracksTable.title == track_data['title'])
        ).scalar_one_or_none()

        if not existing_track:
            new_track = TracksTable(**track_data)
            session.add(new_track)
            session.commit()
            track_id = new_track.id
        else:
            track_id = existing_track.id  

        try:
            existing_track = session.execute(
				select(UserTracksTable).where((UserTracksTable.track_id == track_data['id']) & (UserTracksTable.user_id == user_id))
			).scalar_one_or_none()
            
            if not existing_track:
                new_user_track = UserTracksTable(
					year=year,
					user_id=user_id,
					track_id=track_id,
					rank=get_next_rank(year, user_id)
				)
                session.add(new_user_track)
                session.commit()
            else: 
                raise HTTPException(status_code=409, detail="This track is aleady in the list")
    
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))


def swap_track_rank(track_id: str, direction: str):
    with session_factory() as session:
        current = session.get(UserTracksTable, track_id)
        if not current or current.rank is None:
            raise HTTPException(status_code=404, detail="Track not found or has no rank")

        user_id = current.user_id
        current_rank = current.rank
        current_year = current.year

        if direction == 'up':
            neighbor_rank = current_rank - 1
        elif direction == 'down':
            neighbor_rank = current_rank + 1
        else:
            raise HTTPException(status_code=400, detail="Direction must be 'up' or 'down'")

        if neighbor_rank < 1 or neighbor_rank > 30:
            raise HTTPException(status_code=400, detail="Cannot move track outside rank range 1-30")

        neighbor = (
            session.query(UserTracksTable)
            .filter(
                UserTracksTable.user_id == user_id,
                UserTracksTable.year == current_year,
                UserTracksTable.rank == neighbor_rank
            )
            .first()
        )

        if not neighbor:
            raise HTTPException(status_code=404, detail="No track found to swap with")

        temp_rank = -1
        
        current.rank = temp_rank
        session.flush()
        
        neighbor.rank = current_rank
        session.flush()
        
        current.rank = neighbor_rank
        session.commit()

        return {"success": True, "message": f"Swapped with rank {neighbor_rank}"}
