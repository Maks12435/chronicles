import type { MovieType } from '@/static/types'
import axios from 'axios'
import { BASE_URL } from '@/static/urls'

export const fetchMovies = async (): Promise<MovieType[]> => {
    const response = await axios.get<MovieType[]>(`${BASE_URL}/get_movies`)
    return response.data
}
