import type { FootballMatchType, LeagueTableType } from '@/store/types'
import apiRequest from './axios'

export const fetchMatches = async () => {
    return await apiRequest<FootballMatchType[]>({ url: `football/get_matches`, method: 'GET' }, { silent: true })     
}

export const fetchTable = async (league_name: string) => {
    return await apiRequest<LeagueTableType[]>({ url: `football/get_table?league_name=${league_name}`, method: 'GET' }, { silent: true })
}
