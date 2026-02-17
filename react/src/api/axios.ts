import { BASE_URL } from '@/store/global-variables'
import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
})

function gerErrorMessage(err: unknown): string {
    const e = err as AxiosError<any>
    return (e.response?.data as any)?.detail || e.message || 'Request failed'
}

async function apiRequest<T>(config: AxiosRequestConfig, opts?: { silent?: boolean; successMessage?: string }) {
    try {
        const res = await api.request<T>(config)

        if (opts?.successMessage) {
            toast.success(opts.successMessage)
        }

        return res.data
    } catch (err) {
        if (!opts?.silent) toast.error(gerErrorMessage(err))
        throw err
    }
}

export default apiRequest;
