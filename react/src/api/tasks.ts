import type { TaskType } from '@/store/types'
import apiRequest from './axios'

export const fetchTasks = async () => {
    return await apiRequest<TaskType[]>({ url: `tasks/get_tasks`, method: 'GET' }, { silent: true })
}

export const handleTaskAdd = async (task: TaskType | null, refetchTasks: () => void) => {
    await apiRequest({ url: `tasks/add_task`, method: 'POST', data: task }, { successMessage: 'task added successfully' })
    refetchTasks()
}

export const handleTaskUpdate = async (task: TaskType, task_id: number,  refetchTasks: () => void) => {
    await apiRequest({ url: `tasks/update_task?task_id=${task_id}`, method: 'POST', data: task }, { successMessage: 'task updated successfully' })
    refetchTasks()
}

export const handleTaskDelete = async (task_id: number, refetchTasks: () => void) => {
    await apiRequest({ url: `tasks/delete_task?task_id=${task_id}`, method: 'POST' }, { successMessage: 'task deleted successfully' })
    refetchTasks()
}
