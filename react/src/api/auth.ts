import axios from 'axios'
import { AUTH_ROUTE_URL } from '@/static/urls'
import type { UserType } from '@/static/types'
import toast from 'react-hot-toast'

export const handleRegister = async (creds: UserType) => {
    try {
        await axios.post(`${AUTH_ROUTE_URL}/register`, creds)
        toast.success('user successfully registered')
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleLogin = async (creds: { email: string; password: string }) => {
    try {
        await axios.post(`${AUTH_ROUTE_URL}/login`, creds, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true, 
        })
        toast.success('user successfully loged in')
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}
