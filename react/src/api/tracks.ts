import { MUSIC_ROUTE_URL } from '@/static/urls'
import axios from 'axios'
import type { TrackType } from '@/static/types'
import toast from 'react-hot-toast'

export const fetchTracks = async (year: string): Promise<TrackType[]> => {
    try {
        const response = await axios.get(`${MUSIC_ROUTE_URL}/get_tracks?year=${year}`)
        return response.data
    } catch (error: any) {
        console.error('Error durning requeset', error)
        throw error
    }
}

export const handleTrackSearch = async (track_name: string) => {
    try {
        const response = await axios.post(`${MUSIC_ROUTE_URL}/music_search?track_name=${track_name}`)
        return response.data
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleArtistSearch = async (artist_name: string) => {
    try {
        const response = await axios.post(`${MUSIC_ROUTE_URL}/artist_search?artist_name=${artist_name}`)
        return response.data
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleTrackAdd = async (track: TrackType | null, year: string, refetchTracks: () => void) => {
    try {
        const response = await axios.post(`${MUSIC_ROUTE_URL}/add_track?year=${year}`, track)
        refetchTracks()
        toast.success('Track added successfully')
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

export const handleDelete = async (track_id: number) => {
    try {
        await axios.post(`${MUSIC_ROUTE_URL}/delete_track?track_id=${track_id}`)
        toast.success('Track was successfully deleted')
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleSwapRankNext = async (track_id: number) => {
    try {
        await axios.post(`${MUSIC_ROUTE_URL}/swap_rank_next?track_id=${track_id}`)
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}
export const handleSwapRankPrevious = async (track_id: number) => {
    try {
        await axios.post(`${MUSIC_ROUTE_URL}/swap_rank_previous?track_id=${track_id}`)
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}
