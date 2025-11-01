from uuid import UUID
from queries import books
from models import Books
from fastapi import APIRouter, HTTPException, Query, Request
from services.booksapi import find_book
from auth.auth import get_current_user_id

router = APIRouter(prefix='/books', tags=["books"])

@router.get('/books_search')
def books_search(book_name: str = None, book_author: str = None, book_isbn: str = None, released_year: int = None):
    book = find_book(book_name, book_author, book_isbn, released_year)
    if not book:
        raise HTTPException(
            status_code=404,
            detail=f"book with name '{book_name}' not found"
        )
    return book

@router.get('/get_books')
def get_books(year: int, request: Request):
    user_id = get_current_user_id(request)
    return books.select_books(year, user_id)

@router.post('/add_book')
def add_book(request: Request, book: Books, year: int = Query(...)):
    user_id = get_current_user_id(request)
    try:
        return books.insert_book(book, user_id, year)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.post('/delete_book')
def delete(request: Request, book_id: UUID):
    user_id = get_current_user_id(request)
    return books.delete_book(book_id)

@router.post('/update_rating')
def update_r(request: Request, rating: float, id: UUID):
    user_id = get_current_user_id(request)
    return books.update_book_rating(rating, id)
