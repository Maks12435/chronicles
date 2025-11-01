import type { GenresCountType, MovieType, SeriesType } from '@/static/types'
import axios from 'axios'
import { SHOWS_ROUTE_URL } from '@/static/urls'
import toast from 'react-hot-toast'
import api from './axios'

export const fetchMovies = async (year: string): Promise<MovieType[]> => {
    const response = await axios.get<MovieType[]>(`${SHOWS_ROUTE_URL}/get_movies?year=${year}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    })
    return response.data
}

export const fetchSeries = async (year: string): Promise<SeriesType[]> => {
    const response = await axios.get<SeriesType[]>(`${SHOWS_ROUTE_URL}/get_series?year=${year}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    })
    return response.data
}

export const updateRating = async (rating: number, movie_id: number, type: string) => {
    await api.post(`${SHOWS_ROUTE_URL}/update_rating?rating=${rating}&id=${movie_id}&type=${type}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    })
}

export const handleMovieAdd = async (movie: MovieType | null, personal_rating: number, refetchMovies: () => void) => {
    if (!personal_rating) {
        toast.error('First you need to rate this movie')
    } else if (personal_rating > 10 || personal_rating < 0) {
        toast.error('Your rating is out of range')
    } else {
        try {
            const response = await api.post(
                `${SHOWS_ROUTE_URL}/add_movie`,
                {
                    data: movie,
                    personal_rating: personal_rating,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            )
            refetchMovies()
            toast.success('Movie has been successfully added.')
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.detail)
            } else {
                toast.error(error.message)
            }
        }
    }
}

export const handleMovieSearch = async (movie_name: string, setLoading: (loading: boolean) => void) => {
    try {
        setLoading(true)
        const response = await axios.get(`${SHOWS_ROUTE_URL}/movie_search?movie_name=${movie_name}`)
        setLoading(false)
        return response.data
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
        setLoading(false)
    }
}

export const handleSeriesAdd = async (series: SeriesType | null, personal_rating: number, refetchSeries: () => void) => {
    if (!personal_rating) {
        toast.error('First you need to rate this series')
    } else if (personal_rating > 10 || personal_rating < 0) {
        toast.error('Your rating is out of range')
    } else {
        try {
            const response = await api.post(`${SHOWS_ROUTE_URL}/add_series`, {
                    data: series,
                    personal_rating: personal_rating,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                })
            refetchSeries()
            toast.success('The series has been successfully added')
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.detail)
            } else {
                toast.error(error.message)
            }
        }
    }
}

export const handleSeriesSearch = async (series_name: string, season: number, setLoading: (loading: boolean) => void) => {
    try {
		setLoading(true)
        const response = await axios.get(`${SHOWS_ROUTE_URL}/series_search?series_name=${series_name}&season=${season}`)
		setLoading(false)
        return response.data
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
		setLoading(false)
    }
}

export const handleSeriesDelete = async (series_id: number) => {
    try {
        await api.post(`${SHOWS_ROUTE_URL}/delete_series?series_id=${series_id}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        toast.success('Series successfully deleted')
    } catch (error: any) {
        console.log(error.message)
    }
}

export const handleMovieDelete = async (movie_id: number) => {
    try {
        await api.post(`${SHOWS_ROUTE_URL}/delete_movie?movie_id=${movie_id}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        toast.success('Movies successfully deleted')
    } catch (error: any) {
        console.log(error.message)
    }
}
