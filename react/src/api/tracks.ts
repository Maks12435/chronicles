import { BASE_URL } from '@/static/urls'
import axios from 'axios'
import type { TrackType } from '@/static/types'
import type { ArtistCountType } from '@/static/types'
import type { GenresCountType } from '@/static/types'

export const fetchTracks = async (year: string): Promise<TrackType[]> => {
    const response = await axios.get(`${BASE_URL}/get_tracks?year=${year}`)
    return response.data
}

export const fetchGenresCount = async (year: string): Promise<GenresCountType[]> => {
    const response = await axios.get(`${BASE_URL}/get_genres?year=${year}`)
    return response.data
}

export const fetchArtistsCount = async (year: string): Promise<ArtistCountType[]> => {
    const response = await axios.get(`${BASE_URL}/get_artists?year=${year}`)
    return response.data
}