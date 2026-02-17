import axios from 'axios'
import { BASE_URL } from '@/store/global-variables'
import type { UserType } from '@/store/types'
import toast from 'react-hot-toast'
import { useUser } from '@/store/global-variables'
import apiRequest from './axios'

export const handleRegister = async (creds: UserType) => {
    apiRequest(
        { url: 'auth/register', method: 'POST', data: creds },
        { successMessage: 'user successfully registered' }
    )
}

export const handleLogin = async (creds: { email: string; password: string }) => {
    await apiRequest(
        { url: 'auth/login', method: 'POST', data: creds },
        { successMessage: 'user successfully logged in' }
    )

    const checkResponse = await apiRequest<UserType>({ url: 'auth/check', method: 'GET' })

    useUser.getState().setUser(checkResponse)
}

export const handleLogout = async () => {
    await apiRequest({ url: 'auth/logout', method: 'POST' }, { successMessage: 'user successfully logged out' })
    useUser.getState().setUser(null)
    window.location.href = '/auth/login'
}

export const handleDelete = async () => {
    await apiRequest({ url: 'auth/delete_account', method: 'POST' }, { successMessage: 'account successfully deleted' })
    useUser.getState().setUser(null)
    window.location.href = '/auth/login'
}

export const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/login/google`
}

export const ChangePassword = async (prevPass: string, newPass: string, confirmPass: string) => {
    if (newPass !== confirmPass) {
        return toast.error('New and confirmed passwords are not the same')
    }
    if (prevPass === newPass) {
        return toast.error('New password must be different from the previous one')
    }

    apiRequest(
        { url: 'auth/change_password', method: 'POST', data: { prevPass, newPass } },
        { successMessage: 'Password successfully changed' }
    )
}
