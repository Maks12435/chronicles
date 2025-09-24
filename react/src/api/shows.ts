import type { GenresCountType, MovieType, SeriesType } from '@/static/types'
import axios from 'axios'
import { SHOWS_ROUTE_URL } from '@/static/urls'
import toast from 'react-hot-toast'

export const fetchMovies = async (year: string): Promise<MovieType[]> => {
    const response = await axios.get<MovieType[]>(`${SHOWS_ROUTE_URL}/get_movies?year=${year}`)
    return response.data
}

export const fetchSeries = async (year: string): Promise<SeriesType[]> => {
    const response = await axios.get<SeriesType[]>(`${SHOWS_ROUTE_URL}/get_series?year=${year}`)
    return response.data
}

export const updateRating = async (rating: number, movie_id: number, type: string) => {
    await axios.post(`${SHOWS_ROUTE_URL}/update_rating?rating=${rating}&id=${movie_id}&type=${type}`)
}

export const handleMovieAdd = async (movie: MovieType | null, refetchMovies: () => void) => {
    if (!movie?.personal_rating) {
        toast.error('First you need to rate this movie')
    } else if (movie.personal_rating > 10 || movie.personal_rating < 0) {
        toast.error('Your rating is out of range')
    } else {
        try {
            const response = await axios.post(`${SHOWS_ROUTE_URL}/add_movie`, movie)
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

export const handleMovieSearch = async (movie_name: string) => {
    try {
        const response = await axios.get(`${SHOWS_ROUTE_URL}/movie_search?movie_name=${movie_name}`)
        return response.data
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleSeriesAdd = async (series: SeriesType | null, refetchSeries: () => void) => {
    if (!series?.personal_rating) {
        toast.error('First you need to rate this series')
    } else if (series.personal_rating > 10 || series.personal_rating < 0) {
        toast.error('Your rating is out of range')
    } else {
        try {
            const response = await axios.post(`${SHOWS_ROUTE_URL}/add_series`, series)
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

export const handleSeriesSearch = async (series_name: string, season: number) => {
    try {
        const response = await axios.get(`${SHOWS_ROUTE_URL}/series_search?series_name=${series_name}&season=${season}`)
        return response.data
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleSeriesDelete = async (series_id: number) => {
    try {
        await axios.post(`${SHOWS_ROUTE_URL}/delete_series?series_id=${series_id}`)
        toast.success('Series successfully deleted')
    } catch (error: any) {
        console.log(error.message)
    }
}

export const handleMovieDelete = async (movie_id: number) => {
    try {
        await axios.post(`${SHOWS_ROUTE_URL}/delete_movie?movie_id=${movie_id}`)
        toast.success('Movies successfully deleted')
    } catch (error: any) {
        console.log(error.message)
    }
}
