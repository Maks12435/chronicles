from fastapi import HTTPException
from sqlalchemy import exists, select, func, case, cast, String, distinct, Numeric, desc, asc, update
from db import session_factory
from models import MovieTable, SeriesTable, Tracks, TracksTable, GoalsTable, MatchesTable, TeamsTable, StadiumsTable, TournamentsTable
from sqlalchemy.orm import aliased


def select_tracks(year: int):
    with session_factory() as session:
        query = (
            select(TracksTable).where(TracksTable.year == year).order_by(TracksTable.rank.asc())
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
        
def select_genres(year: int):
    with session_factory() as session:
        query = (
            select(TracksTable.genre, func.count().label('genres_count')).where(TracksTable.year == year)
            .group_by(TracksTable.genre)
        )
        results = session.execute(query).all()

        return [{"genre": genre, "count": count} for genre, count in results]
    
def select_artists(year: int):
    with session_factory() as session:
        query = (
            select(TracksTable.artist, func.count().label('artists_count')).where(TracksTable.year == year)
            .group_by(TracksTable.artist)
            .order_by(desc(func.count()))
        )
        results = session.execute(query).all()

        return [{"artist": artist, "count": count} for artist, count in results]

def get_next_rank(year: int):
    with session_factory() as session:
        used_ranks = (
            session.query(TracksTable.rank)
            .filter(TracksTable.year == year, TracksTable.rank != None)
            .all()
        )
        used = {r[0] for r in used_ranks}
        for i in range(1, 31):
            if i not in used:
                return i
        raise ValueError("The Top is already overfilled")


def track_exists(session, track_name: str) -> bool:
    stmt = select(exists().where(TracksTable.title == track_name))
    return session.scalar(stmt)

def insert_track(track, year):
    with session_factory() as session:
        track_data = track.dict()
        try:
            track_data["rank"] = get_next_rank(year)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e)) 

        if track_exists(session, track_data['title']):
            raise ValueError("A track with this name already exists")
        
        session.add(TracksTable(**track_data))
        session.commit()


def swap_with_next_rank(track_id):
    with session_factory() as session:
        current = session.get(TracksTable, track_id)
        if not current or current.rank is None:
            raise ValueError("Track not found or has no rank")

        current_rank = current.rank
        current_year = current.year

        next_track = (
            session.query(TracksTable)
            .filter(
                TracksTable.rank < current_rank,
                TracksTable.year == current_year
            )
            .order_by(TracksTable.rank.desc())
            .first()
        )

        if not next_track:
            raise ValueError("No track with higher rank to swap with")

        current.rank = -1
        session.commit() 

        old_next_rank = next_track.rank
        next_track.rank = current_rank
        session.commit()  

        current.rank = old_next_rank
        session.commit()  

def swap_with_previous_rank(track_id):
    with session_factory() as session:
        current = session.get(TracksTable, track_id)
        if not current or current.rank is None:
            raise ValueError("Track not found or has no rank")

        current_rank = current.rank
        current_year = current.year

        previous_track = (
            session.query(TracksTable)
            .filter(
                TracksTable.rank > current_rank,
                TracksTable.year == current_year
            )
            .order_by(TracksTable.rank.asc())
            .first()
        )

        if not previous_track:
            raise ValueError("No track with lower rank to swap with")

        current.rank = -1
        session.commit() 

        old_next_rank = previous_track.rank
        previous_track.rank = current_rank
        session.commit()  

        current.rank = old_next_rank
        session.commit()  




def select_matces():
    with session_factory() as session:
        Team1 = aliased(TeamsTable)
        Team2 = aliased(TeamsTable)
        Stadium = aliased(StadiumsTable)
        Tournament = aliased(TournamentsTable)

        query = (
            select(MatchesTable, Team1, Team2, Stadium, Tournament)
            .join(Team1, MatchesTable.team1_id == Team1.id)
            .join(Team2, MatchesTable.team2_id == Team2.id)
            .join(Stadium, MatchesTable.stadium_id == Stadium.id)
            .join(Tournament, MatchesTable.tournament_id == Tournament.id)
        )

        matches = session.execute(query).all()

        data = []
        for match, team1, team2, stadium, tournament in matches:
            goals_query = (
                select(GoalsTable)
                .where(GoalsTable.match_id == match.id)
                .order_by(GoalsTable.minute)
            )
            goals = session.execute(goals_query).scalars().all()

            goals_by_team = {
                team1.id: [],
                team2.id: []
            }
            for goal in goals:
                goals_by_team[goal.team_id].append({
                    "minute": goal.minute,
                    "scorer": goal.scorer,
                })

            data.append({
                "id": match.id,
                "score": match.score,
                "date": match.match_date,
                "stadium": stadium.name,
                "tournament": tournament.name,
                "image": match.image,
                "stage": match.stage,
                "team1": {
                    "name": team1.name,
                    "logo": team1.logo,
                    "xg": match.team1_xg,
                    "shots": match.team1_shots,
                    "shots_on_target": match.team1_shots_on_target,
                    "possession": match.team1_possession,
                    "goals": goals_by_team.get(team1.id, [])
                },
                "team2": {
                    "name": team2.name,
                    "logo": team2.logo,
                    "xg": match.team2_xg,
                    "shots": match.team2_shots,
                    "shots_on_target": match.team2_shots_on_target,
                    "possession": match.team2_possession,
                    "goals": goals_by_team.get(team2.id, [])
                }
            })


        return data





def select_movies(year):
    with session_factory() as session:
        query = select(MovieTable).where(MovieTable.year == year).order_by((MovieTable.personal_rating).desc())
        result = session.execute(query)
        movies = result.scalars().all()

        return [movie for movie in movies]

def select_series(year):
    with session_factory() as session:
        query = select(SeriesTable).where(SeriesTable.year == year).order_by((SeriesTable.personal_rating).desc())
        result = session.execute(query)
        series = result.scalars().all()

        return [item for item in series]


def movie_exists(session, movie_title: str) -> bool:
    stmt = select(exists().where(MovieTable.title == movie_title))
    return session.scalar(stmt)

def series_exists(session, series_title: str, series_season: int) -> bool:
    stmt = select(
        exists().where(
            (SeriesTable.title == series_title) & (SeriesTable.season_number == series_season)
        )
    )
    return session.scalar(stmt)
    
def insert_movie(movie):
    with session_factory() as session:
        movie_data = movie.dict()
        if movie_exists(session, movie_data["title"]):
            raise ValueError("A film with this name already exists")
        
        session.add(MovieTable(**movie_data))
        session.commit()

def insert_series(series):
    with session_factory() as session:
        series_data = series.dict()
        if series_exists(session, series_data["title"], series_data["season_number"]):
            raise ValueError("A series with this name already exists.")
        
        session.add(SeriesTable(**series_data))
        session.commit()

def update_rating(rating, id, type):
    with session_factory() as session:
        table = MovieTable if type == "movies" else SeriesTable
        stmt = (
            update(table)
            .where(table.id == id)
            .values(personal_rating=rating)
        )
        session.execute(stmt)
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
        
def delete_series(series_id):
    with session_factory() as session:
        series = session.get(SeriesTable, series_id)
        if series:
            session.delete(series)
            session.commit()
            return {"message": "series deleted"}
        else:
            return {"error": "series not found"}
        