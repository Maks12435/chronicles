import axios from 'axios'
import { AUTH_ROUTE_URL } from '@/static/urls'
import type { UserType } from '@/static/types'
import toast from 'react-hot-toast'
import { useUser } from '@/store/userInfo'
import { redirect } from '@tanstack/react-router'

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

export const handleLogout = async () => {
    try {
        await axios.post(`${AUTH_ROUTE_URL}/logout`, {}, { withCredentials: true })
        useUser.getState().setUser(null)
        window.location.href = '/auth/login'
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleDelete = async () => {
    try {
        await axios.post(`${AUTH_ROUTE_URL}/delete_account`, {}, { withCredentials: true })
        useUser.getState().setUser(null)
        window.location.href = '/auth/login'
    } catch (error: any) {
        if (error.response) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleGoogleLogin = () => {
    window.location.href = `${AUTH_ROUTE_URL}/login/google`
}

export const ChangePassword = async (prevPass: string, newPass: string, confirmPass: string) => {
    if (newPass !== confirmPass) {
        return toast.error('New and confirmed passwords are not the same')
    }
    if (prevPass === newPass) {
        return toast.error('New password must be different from the previous one')
    }

    try {
        await axios.post(
            `${AUTH_ROUTE_URL}/change_password`,
            { prevPass, newPass },
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        )

        toast.success('Password successfully changed')
    } catch (error: any) {
        const detail = error.response?.data?.detail

        if (Array.isArray(detail)) {
            toast.error(detail[0].msg)
        } else if (typeof detail === 'string') {
            toast.error(detail)
        } else {
            toast.error(error.message || 'An unexpected error occurred')
        }
    }
}
