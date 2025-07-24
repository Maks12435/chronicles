import { BASE_URL } from '@/static/urls'
import axios from 'axios'

export const fetchMatches = async () => {
    const response = await axios.get(`${BASE_URL}/get_matches`)
    return response.data
}
