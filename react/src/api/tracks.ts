import { MUSIC_ROUTE_URL } from '@/static/urls'
import axios from 'axios'
import type { TrackType } from '@/static/types'
import toast from 'react-hot-toast'

export const fetchTracks = async (year: string): Promise<TrackType[]> => {
    try {
        const response = await axios.get(`${MUSIC_ROUTE_URL}/get_tracks?year=${year}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        return response.data
    } catch (error: any) {
        console.error('Error durning requeset', error)
        throw error
    }
}

export const handleTrackSearch = async (track_name: string, setLoading: (bool: boolean) => void) => {
    try {
        setLoading(true)
        const response = await axios.post(`${MUSIC_ROUTE_URL}/music_search?track_name=${track_name}`)
        setLoading(false)
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
        const response = await axios.post(`${MUSIC_ROUTE_URL}/add_track?year=${year}`, track, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
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
        await axios.post(`${MUSIC_ROUTE_URL}/delete_track?track_id=${track_id}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        toast.success('Track was successfully deleted')
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleSwapRank = async (track_id: number, direction: string) => {
    try {
        await axios.post(`${MUSIC_ROUTE_URL}/swap_track_rank?track_id=${track_id}&direction=${direction}`)
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

