import type { BookType } from '@/store/types'
import toast from 'react-hot-toast'
import apiRequest from './axios'

export const fetchBooks = async (year: number): Promise<BookType[]> => {
    return apiRequest<BookType[]>({ url: `books/get_books?year=${year}`, method: 'GET' }, { silent: true })
}

export const handleBooksearch = async (
    book_name?: string,
    book_author?: string,
    book_isbn?: string,
    released_year?: number
) => {
    return apiRequest<BookType | null>({
        url: 'books/books_search',
        method: 'GET',
        params: { book_name, book_author, book_isbn, released_year },
    })
}

export const handleBookAdd = async (book: BookType | null, refetchBooks: () => void) => {
    if (!book?.personal_rating) {
        toast.error('First you need to rate this book')
    } else if (book.personal_rating > 5 || book.personal_rating < 0) {
        toast.error('Your rating is out of range')
    } else {
        await apiRequest(
            { url: `books/add_book`, method: 'POST', data: book },
            { successMessage: 'book added successfully' }
        )
        refetchBooks()
    }
}

export const handleDelete = async (book_id: number) => {
    await apiRequest(
        { url: `books/delete_book?book_id=${book_id}`, method: 'POST' },
        { successMessage: 'book was successfully deleted' }
    )
}

export const updateRating = async (rating: number, book_id: number) => {
    await apiRequest(
        { url: `books/update_book_rating?book_id=${book_id}&personal_rating=${rating}`, method: 'POST' },
        { successMessage: 'Rating updated successfully' }
    )
}
