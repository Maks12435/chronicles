import type { MovieType, SeriesType } from '@/store/types'
import toast from 'react-hot-toast'
import apiRequest from './axios'

export const fetchMovies = async (year: number): Promise<MovieType[]> => {
    return apiRequest<MovieType[]>({ url: `shows/get_movies?year=${year}`, method: 'GET' }, { silent: true })
}

export const fetchSeries = async (year: number): Promise<SeriesType[]> => {
    return apiRequest<SeriesType[]>({ url: `shows/get_series?year=${year}`, method: 'GET' }, { silent: true })
}

export const updateRating = async (rating: number, movie_id: number, type: string) => {
    await apiRequest(
        { url: `shows/update_rating?rating=${rating}&id=${movie_id}&type=${type}`, method: 'POST' },
        { successMessage: 'Rating updated successfully' }
    )
}

export const handleMovieAdd = async (movie: MovieType | null, personal_rating: number, refetchMovies: () => void) => {
    if (!personal_rating) {
        toast.error('First you need to rate this movie')
    } else if (personal_rating > 10 || personal_rating < 0) {
        toast.error('Your rating is out of range')
    } else {
        await apiRequest(
            { url: `shows/add_movie`, method: 'POST', data: { data: movie, personal_rating } },
            { successMessage: 'Movie has been successfully added.' }
        )
        refetchMovies()
    }
}

export const handleMovieSearch = async (movie_name: string, setLoading: (loading: boolean) => void) => {
    setLoading(true)
    return apiRequest<MovieType | null>({ url: `shows/movie_search?movie_name=${movie_name}`, method: 'GET' }, { silent: true }).finally(() => setLoading(false))
}

export const handleSeriesAdd = async (
    series: SeriesType | null,
    personal_rating: number,
    refetchSeries: () => void
) => {
    if (!personal_rating) {
        toast.error('First you need to rate this series')
    } else if (personal_rating > 10 || personal_rating < 0) {
        toast.error('Your rating is out of range')
    } else {
        await apiRequest(
            { url: `shows/add_series`, method: 'POST', data: { data: series, personal_rating } },
            { successMessage: 'The series has been successfully added' }
        )
        refetchSeries()
    }
}

export const handleSeriesSearch = async (
    series_name: string,
    season: number,
    setLoading: (loading: boolean) => void
) => {
    setLoading(true)
    return apiRequest<SeriesType | null>(
        { url: `shows/series_search?series_name=${series_name}&season=${season}`, method: 'GET' },
        { silent: true }
    ).finally(() => setLoading(false))
}

export const handleSeriesDelete = async (series_id: number) => {
    await apiRequest({ url: `shows/delete_series?series_id=${series_id}`, method: 'POST' }, { successMessage: 'Series successfully deleted' })
}

export const handleMovieDelete = async (movie_id: number) => {
    await apiRequest({ url: `shows/delete_movie?movie_id=${movie_id}`, method: 'POST' }, { successMessage: 'Movie successfully deleted' })
}
