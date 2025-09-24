import type { ArtistType } from '@/static/types'
import type { TrackType } from '@/static/types'

const now = new Date()
export const currentYear = now.getFullYear()

const STORAGE_KEY = 'year-data'

type YearData = {
    artist: ArtistType | null
    track: TrackType | null
}

export function saveYearData(year: string, data: Partial<YearData>) {
    const allData: Record<string, YearData> = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const current = allData[year] || { artist: null, track: null }
    allData[year] = { ...current, ...data }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
}

export function loadYearData(year: string): YearData {
    const allData: Record<string, YearData> = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return allData[year] || { artist: null, track: null }
}
