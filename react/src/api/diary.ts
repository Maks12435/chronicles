import type { DiaryType } from '@/static/types'
import { DIARY_ROUTE_URL } from '@/static/urls'
import axios from 'axios'
import toast from 'react-hot-toast'

export const fetchDiaryRecords = async () => {
    try {
        const response = await axios.get(`${DIARY_ROUTE_URL}/get_diary_records`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        return response.data
    } catch (error: any) {
        throw error
    }
}

export const handleDiaryRecordAdd = async (DiaryRecord: DiaryType | null, refetchDiaryRecords: () => void) => {
    try {
        const response = await axios.post(`${DIARY_ROUTE_URL}/add_diary_record`, DiaryRecord, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        refetchDiaryRecords()
        toast.success('Record added successfully')
    } catch (error: any) {
        if (error.response && error.response.data?.detail) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleDiaryRecordUpdate = async (record: DiaryType, record_id: number,  refetchDiaryRecords: () => void) => {
    try {
        const response = await axios.post(`${DIARY_ROUTE_URL}/update_diary_record?record_id=${record_id}`, record)
        refetchDiaryRecords()
        toast.success('Record updated successfully')
    } catch (error: any) {
        if (error.response && error.response.data?.detail) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}

export const handleDiaryRecordDelete = async (record_id: number, refetchDiaryRecords: () => void) => {
    try {
        const response = await axios.post(`${DIARY_ROUTE_URL}/delete_diary_record?record_id=${record_id}`)
        refetchDiaryRecords()
        toast.success('Record deleted successfully')
    } catch (error: any) {
        if (error.response && error.response.data?.detail) {
            toast.error(error.response.data.detail)
        } else {
            toast.error(error.message)
        }
    }
}