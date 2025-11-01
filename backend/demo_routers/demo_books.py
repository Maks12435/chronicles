from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from demo_db import get_db
from sqlalchemy import text
from models import Books

router = APIRouter(prefix='/books', tags=["books"])

@router.get('/books_search')
def books_search(book_name: str = None, book_author: str = None, book_isbn: str = None, released_year: int = None):
    return {
        "title": "1984",
        "author": "George Orwell",
        "isbn": "9780451524935",
        "released_year": "1949",
        "image": "https://covers.openlibrary.org/b/id/7222246-L.jpg",
        "personal_rating": 9.0,
        "average_rating": 8.7,
        "description": "A dystopian social science fiction novel",
        "language": "English",
        "country": "UK",
        "price": "$9.99",
        "web_reader_link": ""
    }

@router.get('/get_books')
def get_books(year: int, db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT b.*, ub.personal_rating, ub.addition_date 
        FROM user_books ub 
        JOIN books b ON ub.book_id = b.id
        WHERE ub.user_id = 'demo-user-id' AND ub.year = :year
    """), {"year": year}).fetchall()
    
    user_books = []
    for row in result:
        user_books.append({
            "id": row[0],
            "title": row[1],
            "author": row[2],
            "isbn": row[3],
            "released_year": row[4],
            "image": row[5],
            "personal_rating": row[6],
            "average_rating": row[7],
            "description": row[8],
            "year": row[9],
            "language": row[10],
            "country": row[11],
            "price": row[12],
            "web_reader_link": row[13],
            "personal_rating": row[14],
            "addition_date": row[15]
        })
    return user_books

@router.post('/add_book')
def add_book(book: Books, year: int = Query(...), db: Session = Depends(get_db)):
    return {
        "message": "Книга успешно добавлена",
        "book": {
            "id": "new-demo-book",
            "title": book.title,
            "author": book.author,
            "genre": "Жанр",
            "rating": 8.0
        }
    }

@router.post('/delete_book')
def delete(book_id: str):
    return {"message": f"Книга {book_id} удалена"}

@router.post('/update_rating')
def update_r(rating: float, id: str):
    return {"message": f"Рейтинг книги {id} обновлен до {rating}"}

@router.get('/stats')
async def get_books_stats(db: Session = Depends(get_db)):
    return {
        "total_books": 2,
        "average_rating": 8.75,
        "top_author": "George Orwell",
        "recently_added": 1
    }
