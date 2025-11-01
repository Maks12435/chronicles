import { FOOTBALL_ROUTE_URL } from '@/static/urls'
import axios from 'axios'

export const fetchMatches = async () => {
    const response = await axios.get(`${FOOTBALL_ROUTE_URL}/get_matches`)
    return response.data
}

export const fetchTable = async (league_name: string) => {
    const response = await axios.get(`${FOOTBALL_ROUTE_URL}/get_table?league_name=${league_name}`)
    return response.data
}
