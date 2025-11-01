import { BOOKS_ROUTE_URL } from '@/static/urls'
import axios from 'axios'
import type { BookType } from '@/static/types'
import toast from 'react-hot-toast'

export const fetchBooks = async (year: string): Promise<BookType[]> => {
    try {
        const response = await axios.get(`${BOOKS_ROUTE_URL}/get_books?year=${year}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        return response.data
    } catch (error: any) {
        console.error('Error durning requeset', error)
        throw error
    }
}

export const handleBooksearch = async (
    book_name?: string,
    book_author?: string,
    book_isbn?: string,
    released_year?: number
) => {
    try {
        const response = await axios.get(`${BOOKS_ROUTE_URL}/books_search`, {
            params: {
                book_name,
                book_author,
                book_isbn,
                released_year,
            },
        })
        return response.data
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleBookAdd = async (book: BookType | null, year: string, refetchbooks: () => void) => {
    if (!book?.personal_rating) {
        toast.error('First you need to rate this book')
    } else if (book.personal_rating > 5 || book.personal_rating < 0) {
        toast.error('Your rating is out of range')
    } else {
        try {
            const response = await axios.post(`${BOOKS_ROUTE_URL}/add_book?year=${year}`, book, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            refetchbooks()
            toast.success('book added successfully')
        } catch (error: any) {
            if (error.response && error.response.data?.detail) {
                toast.error(error.response.data.detail)
            } else if (error.message) {
                toast.error(error.message)
            } else {
                toast.error(error.message)
            }
        }
    }
}

export const handleDelete = async (book_id: number) => {
    try {
        await axios.post(`${BOOKS_ROUTE_URL}/delete_book?book_id=${book_id}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        toast.success('book was successfully deleted')
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const updateRating = async (rating: number, book_id: number) => {
    await axios.post(`${BOOKS_ROUTE_URL}/update_rating?rating=${rating}&id=${book_id}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    })
}
