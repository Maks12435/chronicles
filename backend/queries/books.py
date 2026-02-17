from uuid import UUID
from sqlalchemy import exists, select, update
from db import session_factory
from models import BooksTable, UserBooksTable

def select_books(year: int, user_id: UUID):
    with session_factory() as session:
        query = (
            select(BooksTable, UserBooksTable)
            .join(UserBooksTable, UserBooksTable.book_id == BooksTable.id)
            .where((UserBooksTable.year == year) & (UserBooksTable.user_id == user_id))
            .order_by(UserBooksTable.personal_rating.desc())
        )

        result = session.execute(query).all()

        books = []
        for book, user_book in result:
            books.append({
                "id": user_book.id,
                "book_id": book.id,
                "title": book.title,
                "author": book.author,
                "isbn": book.isbn,
                "released_year": book.released_year,
                "image": book.image,
                "personal_rating": user_book.personal_rating,
                "average_rating": book.average_rating,
                "description": book.description,
                "language": book.language,
                "country": book.country,
                "price": book.price,
                "web_reader_link": book.web_reader_link,
                "year": user_book.year,
                "addition_date": user_book.addition_date.isoformat() if user_book.addition_date else None
            })

        return books

def delete_book(book_id: UUID):
    with session_factory() as session:
        book = session.get(UserBooksTable, book_id)
        if book:
            session.delete(book)
            session.commit()
            return {"message": "book deleted"}
        else:
            return {"error": "book not found"}

def book_exists(session, book_name: str) -> bool:
    stmt = select(exists().where(BooksTable.title == book_name))
    return session.scalar(stmt)

def user_book_exists(session, user_id: UUID, book_id: int) -> bool:
    stmt = select(
        exists().where(
            (UserBooksTable.user_id == user_id) & (UserBooksTable.book_id == book_id)
        )
    )
    return session.scalar(stmt)

def insert_book(book, user_id: UUID):
    with session_factory() as session:
        book_data = book.dict()

        existing_book = session.execute(
            select(BooksTable).where(BooksTable.title == book_data['title'])
        ).scalar_one_or_none()

        if not existing_book:
            new_book = BooksTable(**book_data)
            session.add(new_book)
            session.commit()
            book_id = new_book.id
        else:
            book_id = existing_book.id

        if user_book_exists(session, user_id, book_id):
            raise ValueError("This book is already in your list")
        
        new_user_book = UserBooksTable(
            user_id=user_id,
            book_id=book_id,
            personal_rating=book_data.get('personal_rating'),
        )
        session.add(new_user_book)
        session.commit()
        
def update_book_rating(rating: float, id: UUID):
    with session_factory() as session:
        stmt = (
            update(UserBooksTable)
            .where(UserBooksTable.id == id)
            .values(personal_rating=rating)
        )
        session.execute(stmt)
        session.commit()
