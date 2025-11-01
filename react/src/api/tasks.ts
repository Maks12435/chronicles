import type { TaskType } from '@/static/types'
import { TASKS_ROUTE_URL } from '@/static/urls'
import axios from 'axios'
import toast from 'react-hot-toast'

export const fetchTasks = async () => {
    try {
        const response = await axios.get(`${TASKS_ROUTE_URL}/get_tasks`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        return response.data
    } catch (error: any) {
        throw error
    }
}

export const handleTaskAdd = async (task: TaskType | null, refetchTasks: () => void) => {
    try {
        const response = await axios.post(`${TASKS_ROUTE_URL}/add_task`, task, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        refetchTasks()
        toast.success('task added successfully')
    } catch (error: any) {
        if (error.response && error.response.data?.detail) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleTaskUpdate = async (task: TaskType, task_id: number,  refetchTasks: () => void) => {
    try {
        const response = await axios.post(`${TASKS_ROUTE_URL}/update_task?task_id=${task_id}`, task)
        refetchTasks()
        toast.success('task updated successfully')
    } catch (error: any) {
        if (error.response && error.response.data?.detail) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleTaskDelete = async (task_id: number, refetchTasks: () => void) => {
    try {
        const response = await axios.post(`${TASKS_ROUTE_URL}/delete_task?task_id=${task_id}`)
        refetchTasks()
        toast.success('task deleted successfully')
    } catch (error: any) {
        if (error.response && error.response.data?.detail) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}
