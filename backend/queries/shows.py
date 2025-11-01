from uuid import UUID
from sqlalchemy import exists, select, update
from sqlalchemy.sql import func
from db import session_factory
from models import MovieTable, SeriesTable, SeasonTable, UserMoviesTable, UserSeriesTable


# ----------------------------- MOVIES -----------------------------

def select_movies(year: int, user_id: UUID):
    with session_factory() as session:
        query = (
            select(MovieTable, UserMoviesTable)
            .join(UserMoviesTable, UserMoviesTable.movie_id == MovieTable.id)
            .where((UserMoviesTable.year == year) & (UserMoviesTable.user_id == user_id))
            .order_by(UserMoviesTable.personal_rating.desc())
        )

        result = session.execute(query).all()

        movies = []
        for movie, user_movie in result:
            movies.append({
                "id": user_movie.id,
                "movie_id": movie.id,
                "title": movie.title,
                "original_title": movie.original_title,
                "tagline": movie.tagline,
                "genre": movie.genre,
                "description": movie.description,
                "release_date": movie.release_date.isoformat() if movie.release_date else None,
                "country": movie.country,
                "rating": movie.rating,
                "personal_rating": user_movie.personal_rating,
                "image": movie.image,
                "year": user_movie.year,
                "addition_date": user_movie.addition_date.isoformat() if user_movie.addition_date else None
            })

        return movies


def movie_exists(session, movie_title: str) -> bool:
    stmt = select(exists().where(MovieTable.title == movie_title))
    return session.scalar(stmt)


def user_movie_exists(session, user_id: UUID, movie_id: int) -> bool:
    stmt = select(
        exists().where(
            (UserMoviesTable.user_id == user_id) & (UserMoviesTable.movie_id == movie_id)
        )
    )
    return session.scalar(stmt)


def insert_movie(movie, personal_rating, user_id: UUID):
    with session_factory() as session:
        movie_data = movie.dict()

        existing_movie = session.execute(
            select(MovieTable).where(MovieTable.title == movie_data['title'])
        ).scalar_one_or_none()

        if not existing_movie:
            new_movie = MovieTable(**movie_data)
            session.add(new_movie)
            session.commit()
            movie_id = new_movie.id
        else:
            movie_id = existing_movie.id

        if user_movie_exists(session, user_id, movie_id):
            raise ValueError("This movie is already in your list")
        
        new_user_movie = UserMoviesTable(
            user_id=user_id,
            movie_id=movie_id,
            personal_rating=personal_rating,
        )
        session.add(new_user_movie)
        session.commit()


# ----------------------------- SERIES + SEASONS -----------------------------

def select_series(year: int, user_id: UUID):
    with session_factory() as session:
        query = (
            select(SeriesTable, SeasonTable, UserSeriesTable)
            .join(SeasonTable, SeasonTable.series_id == SeriesTable.id)
            .join(UserSeriesTable, UserSeriesTable.season_id == SeasonTable.id)
            .where((UserSeriesTable.year == year) & (UserSeriesTable.user_id == user_id))
            .order_by(UserSeriesTable.personal_rating.desc())
        )

        result = session.execute(query).all()

        series = []
        for series_item, season, user_series in result:
            series.append({
                "id": user_series.id,
                "series_id": series_item.id,
                "title": series_item.title,
                "original_title": series_item.original_title,
                "tagline": series_item.tagline,
                "genre": series_item.genre,
                "description": series_item.description,
                "release_date": series_item.release_date.isoformat() if series_item.release_date else None,
                "country": series_item.country,
                "rating": series_item.rating,
                "personal_rating": user_series.personal_rating,
                "image": series_item.image,
                "season_number": season.season_number,
                "episodes_count": season.episodes_count,
                "season_overview": season.season_overview,
                "season_poster": season.season_poster,
                "year": user_series.year,
                "addition_date": user_series.addition_date.isoformat() if user_series.addition_date else None
            })

        return series


def series_exists(session, series_title: str) -> bool:
    stmt = select(exists().where(SeriesTable.title == series_title))
    return session.scalar(stmt)


def user_series_exists(session, user_id: UUID, season_id: int) -> bool:
    stmt = select(
        exists().where(
            (UserSeriesTable.user_id == user_id) & (UserSeriesTable.season_id == season_id)
        )
    )
    return session.scalar(stmt)


def insert_series(series, personal_rating, user_id: UUID):
    with session_factory() as session:
        data = series.dict()

        # Проверяем сериал
        existing_series = session.get(SeriesTable, data['id'])
        if not existing_series:
            existing_series = SeriesTable(
                id=data['id'],
                title=data['title'],
                original_title=data['original_title'],
                tagline=data.get('tagline'),
                genre=data.get('genre'),
                description=data.get('description'),
                release_date=data.get('release_date'),
                country=data.get('country'),
                rating=data.get('rating'),
                image=data.get('image')
            )
            session.add(existing_series)
            session.commit()

        # Проверяем сезон
        existing_season = session.execute(
            select(SeasonTable).where(
                (SeasonTable.series_id == existing_series.id) &
                (SeasonTable.season_number == data['season_number'])
            )
        ).scalar_one_or_none()

        if not existing_season:
            new_season = SeasonTable(
                series_id=existing_series.id,
                season_number=data['season_number'],
                episodes_count=data.get('episodes_count'),
                season_overview=data.get('season_overview'),
                season_poster=data.get('season_poster')
            )
            session.add(new_season)
            session.commit()
            season_id = new_season.id
        else:
            season_id = existing_season.id

        # Проверяем, есть ли уже у пользователя этот сезон
        if user_series_exists(session, user_id, season_id):
            raise ValueError("This season is already in your list")

        # Добавляем в user_series
        new_user_series = UserSeriesTable(
            user_id=user_id,
            season_id=season_id,
            personal_rating=personal_rating,
        )
        session.add(new_user_series)
        session.commit()


# ----------------------------- COMMON -----------------------------

def update_rating(rating: float, id: UUID, type: str):
    with session_factory() as session:
        table = UserMoviesTable if type == "movies" else UserSeriesTable
        stmt = (
            update(table)
            .where(table.id == id)
            .values(personal_rating=rating)
        )
        session.execute(stmt)
        session.commit()


def delete_movie(movie_id: UUID):
    with session_factory() as session:
        movie = session.get(UserMoviesTable, movie_id)
        if movie:
            session.delete(movie)
            session.commit()
            return {"message": "movie deleted"}
        else:
            return {"error": "movie not found"}


def delete_series(series_id: UUID):
    with session_factory() as session:
        series = session.get(UserSeriesTable, series_id)
        if series:
            session.delete(series)
            session.commit()
            return {"message": "series deleted"}
        else:
            return {"error": "series not found"}
