import type { ArtistType, TrackType } from '@/store/types'
import apiRequest from './axios'

export const fetchTracks = async (year: number): Promise<TrackType[]> => {
    return apiRequest<TrackType[]>({ url: `music/get_tracks?year=${year}`, method: 'GET' }, { silent: true })
}

export const handleTrackSearch = async (track_name: string, setLoading: (bool: boolean) => void) => {
    setLoading(true)
    return await apiRequest<TrackType | null>({ url: `music/music_search?track_name=${track_name}`, method: 'GET' }, { silent: true }).finally(() => setLoading(false))
}

export const handleArtistSearch = async (artist_name: string) => {
    return apiRequest<ArtistType>({ url: `music/artist_search?artist_name=${artist_name}`, method: 'POST' }, { silent: true })
}

export const handleTrackAdd = async (track: TrackType | null, year: number, refetchTracks: () => void) => {
    await apiRequest({ url: `music/add_track?year=${year}`, method: 'POST', data: track }, { successMessage: 'Track added successfully' })
    refetchTracks()
}

export const handleDelete = async (track_id: number) => {
    await apiRequest({ url: `music/delete_track?track_id=${track_id}`, method: 'POST' }, { successMessage: 'Track was successfully deleted' })
}

export const handleSwapRank = async (track_id: number, direction: string) => {
    await apiRequest({ url: `music/swap_track_rank?track_id=${track_id}&direction=${direction}`, method: 'POST' }, { silent: true })
}

