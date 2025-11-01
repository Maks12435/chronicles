import sqlite3
import uuid
from datetime import datetime, date
import json

def init_demo_database():
    conn = sqlite3.connect('demo_chronicles.db')
    cursor = conn.cursor()
    
    create_tables(cursor)

    insert_demo_data(cursor)
    
    conn.commit()
    conn.close()
    print("✅ Демо-база данных создана успешно!")

def create_tables(cursor):
    """Создание таблиц в SQLite"""
    
    # Таблица пользователей
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT,
            oauth_provider TEXT,
            oauth_id TEXT
        )
    ''')
    
    # Таблица треков
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tracks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            artist TEXT NOT NULL,
            album TEXT NOT NULL,
            genre TEXT NOT NULL,
            duration TEXT NOT NULL,
            small_image TEXT,
            mid_image TEXT,
            big_image TEXT
        )
    ''')
    
    # Таблица пользовательских треков
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_tracks (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            track_id TEXT NOT NULL,
            addition_date DATE NOT NULL,
            rank INTEGER NOT NULL,
            year INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (track_id) REFERENCES tracks (id)
        )
    ''')
    
    # Таблица фильмов
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            original_title TEXT,
            tagline TEXT,
            genre TEXT,
            description TEXT,
            release_date DATE,
            country TEXT,
            rating REAL,
            image TEXT
        )
    ''')
    
    # Таблица пользовательских фильмов
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_movies (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            movie_id INTEGER NOT NULL,
            addition_date DATE NOT NULL,
            personal_rating REAL,
            year INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (movie_id) REFERENCES movies (id)
        )
    ''')
    
    # Таблица сериалов
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS series (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            original_title TEXT,
            tagline TEXT,
            genre TEXT,
            description TEXT,
            release_date DATE,
            country TEXT,
            rating REAL,
            image TEXT
        )
    ''')
    
    # Таблица сезонов
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS seasons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            series_id INTEGER NOT NULL,
            season_number INTEGER NOT NULL,
            episodes_count INTEGER,
            season_overview TEXT,
            season_poster TEXT,
            FOREIGN KEY (series_id) REFERENCES series (id)
        )
    ''')
    
    # Таблица пользовательских сериалов
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_series (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            season_id INTEGER NOT NULL,
            addition_date DATE NOT NULL,
            personal_rating REAL,
            year INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (season_id) REFERENCES seasons (id)
        )
    ''')
    
    # Таблица книг
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            isbn TEXT,
            released_year TEXT,
            image TEXT,
            personal_rating REAL,
            average_rating REAL,
            description TEXT,
            year INTEGER,
            language TEXT,
            country TEXT,
            price TEXT,
            web_reader_link TEXT
        )
    ''')
    
    # Таблица пользовательских книг
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_books (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            book_id INTEGER NOT NULL,
            addition_date DATE NOT NULL,
            personal_rating REAL,
            year INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (book_id) REFERENCES books (id)
        )
    ''')
    
    # Таблица задач
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL,
            difficulty INTEGER DEFAULT 0,
            status TEXT DEFAULT 'in progress',
            created_time DATETIME,
            finished_time DATETIME,
            user_id TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Таблица дневника
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS diary (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_time DATETIME,
            record_type TEXT NOT NULL,
            user_id TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    print("✅ Таблицы созданы успешно!")

def insert_demo_data(cursor):
    """Вставка демо-данных"""
    
    # Демо-пользователь
    demo_user_id = str(uuid.uuid4())
    cursor.execute('''
        INSERT INTO users (id, username, email, password)
        VALUES (?, ?, ?, ?)
    ''', (demo_user_id, 'demo', 'demo@chronicles.com', 'demo1234'))
    
    # Демо-треки
    demo_tracks = [
        ('1', 'Blinding Lights', 'The Weeknd', 'After Hours', 'Pop', '3:20', 
         'https://i.scdn.co/image/ab67616d00004851e2d156fdc691f57900134342',
         'https://i.scdn.co/image/ab67616d00001e02e2d156fdc691f57900134342',
         'https://i.scdn.co/image/ab67616d0000b273e2d156fdc691f57900134342'),
        ('2', 'Save Your Tears', 'The Weeknd', 'After Hours', 'Pop', '3:35',
         'https://i.scdn.co/image/ab67616d00004851e2d156fdc691f57900134342',
         'https://i.scdn.co/image/ab67616d00001e02e2d156fdc691f57900134342',
         'https://i.scdn.co/image/ab67616d0000b273e2d156fdc691f57900134342'),
        ('3', 'Levitating', 'Dua Lipa', 'Future Nostalgia', 'Pop', '3:23',
         'https://i.scdn.co/image/ab67616d0000485180a3acd545545e9d66c7a5e1',
         'https://i.scdn.co/image/ab67616d00001e0280a3acd545545e9d66c7a5e1',
         'https://i.scdn.co/image/ab67616d0000b27380a3acd545545e9d66c7a5e1'),
    ]
    
    for track in demo_tracks:
        cursor.execute('''
            INSERT INTO tracks (id, title, artist, album, genre, duration, small_image, mid_image, big_image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', track)
    
    # Демо-фильмы
    demo_movies = [
        (1, 'Inception', 'Inception', 'Your mind is the scene of the crime', 
         'Sci-Fi, Action', 'A thief who steals corporate secrets through dream-sharing technology',
         '2010-07-16', 'USA', 8.8, 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'),
        (2, 'The Dark Knight', 'The Dark Knight', 'Welcome to a world without rules',
         'Action, Crime', 'Batman faces the Joker, a criminal mastermind',
         '2008-07-18', 'USA', 9.0, 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'),
        (3, 'Interstellar', 'Interstellar', 'Mankind was born on Earth. It was never meant to die here.',
         'Sci-Fi, Drama', 'A team of explorers travel through a wormhole in space',
         '2014-11-07', 'USA', 8.6, 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'),
    ]
    
    for movie in demo_movies:
        cursor.execute('''
            INSERT INTO movies (id, title, original_title, tagline, genre, description, release_date, country, rating, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', movie)
    
    # Демо-сериалы
    demo_series = [
        (1, 'Breaking Bad', 'Breaking Bad', 'Change the equation',
         'Crime, Drama', 'A high school chemistry teacher turned meth maker',
         '2008-01-20', 'USA', 9.5, 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg'),
        (2, 'Stranger Things', 'Stranger Things', 'Something strange is coming',
         'Sci-Fi, Horror', 'A group of kids encounter supernatural forces',
         '2016-07-15', 'USA', 8.7, 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg'),
    ]
    
    for series in demo_series:
        cursor.execute('''
            INSERT INTO series (id, title, original_title, tagline, genre, description, release_date, country, rating, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', series)
    
    # Демо-сезоны
    demo_seasons = [
        (1, 1, 1, 7, 'First season of Breaking Bad', 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg'),
        (2, 2, 1, 8, 'First season of Stranger Things', 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg'),
    ]
    
    for season in demo_seasons:
        cursor.execute('''
            INSERT INTO seasons (id, series_id, season_number, episodes_count, season_overview, season_poster)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', season)
    
    # Демо-книги
    demo_books = [
        ('1984', 'George Orwell', '9780451524935', '1949', 
         'https://covers.openlibrary.org/b/id/7222246-L.jpg', 9.0, 8.7,
         'A dystopian social science fiction novel', 2024, 'English', 'UK', '$9.99', ''),
        ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', '1960',
         'https://covers.openlibrary.org/b/id/7222236-L.jpg', 8.5, 8.3,
         'A novel about racial inequality', 2024, 'English', 'USA', '$12.99', ''),
    ]
    
    for book in demo_books:
        cursor.execute('''
            INSERT INTO books (title, author, isbn, released_year, image, personal_rating, average_rating, description, year, language, country, price, web_reader_link)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', book)
    
    # Демо-пользовательские данные
    current_date = datetime.now().date()
    
    # Пользовательские треки
    cursor.execute('''
        INSERT INTO user_tracks (id, user_id, track_id, addition_date, rank, year)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (str(uuid.uuid4()), demo_user_id, '1', current_date, 1, current_date.year))
    
    # Пользовательские фильмы
    cursor.execute('''
        INSERT INTO user_movies (id, user_id, movie_id, addition_date, personal_rating, year)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (str(uuid.uuid4()), demo_user_id, 1, current_date, 9.0, current_date.year))
    
    # Пользовательские сериалы
    cursor.execute('''
        INSERT INTO user_series (id, user_id, season_id, addition_date, personal_rating, year)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (str(uuid.uuid4()), demo_user_id, 1, current_date, 9.5, current_date.year))
    
    # Пользовательские книги
    cursor.execute('''
        INSERT INTO user_books (id, user_id, book_id, addition_date, personal_rating, year)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (str(uuid.uuid4()), demo_user_id, 1, current_date, 9.0, current_date.year))
    
    # Демо-задачи
    demo_tasks = [
        ('Завершить проект Chronicles', 'Добавить демо-режим и документацию', 'Разработка', 3, 'in progress', datetime.now(), None, demo_user_id),
        ('Прочитать книгу', 'Прочитать "1984" Джорджа Оруэлла', 'Чтение', 2, 'completed', datetime.now(), datetime.now(), demo_user_id),
        ('Посмотреть фильм', 'Посмотреть "Начало" Кристофера Нолана', 'Развлечения', 1, 'in progress', datetime.now(), None, demo_user_id),
    ]
    
    for task in demo_tasks:
        cursor.execute('''
            INSERT INTO tasks (title, description, type, difficulty, status, created_time, finished_time, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', task)
    
    # Демо-записи дневника
    demo_diary = [
        ('Отличный день!', 'Сегодня завершил важный проект и чувствую большое удовлетворение от проделанной работы.', datetime.now(), 'Позитив', demo_user_id),
        ('Новые идеи', 'Придумал несколько интересных идей для улучшения проекта Chronicles.', datetime.now(), 'Идеи', demo_user_id),
        ('Планы на неделю', 'Нужно прочитать новую книгу и посмотреть рекомендованный фильм.', datetime.now(), 'Планы', demo_user_id),
    ]
    
    for diary_entry in demo_diary:
        cursor.execute('''
            INSERT INTO diary (title, description, created_time, record_type, user_id)
            VALUES (?, ?, ?, ?, ?)
        ''', diary_entry)
    
    print("✅ Демо-данные добавлены успешно!")

if __name__ == "__main__":
    init_demo_database()
