import type { DiaryType } from '@/store/types'
import apiRequest from './axios'

export const fetchDiaryRecords = () => {
    return apiRequest<DiaryType[]>(
        {
            url: 'diary/get_diary_records',
            method: 'GET',
        },
        { silent: true }
    )
}

export const handleDiaryRecordAdd = async (DiaryRecord: DiaryType | null, refetchDiaryRecords: () => void) => {
    apiRequest(
        { url: 'diary/add_diary_record', method: 'POST', data: DiaryRecord },
        { successMessage: 'Record added successfully' }
    )
    refetchDiaryRecords()
}

export const handleDiaryRecordUpdate = async (
    record: DiaryType,
    record_id: number,
    refetchDiaryRecords: () => void
) => {
    apiRequest(
        { url: `diary/update_diary_record?record_id=${record_id}`, method: 'POST', data: record },
        { successMessage: 'Record updated successfully' }
    )
    refetchDiaryRecords()
}

export const handleDiaryRecordDelete = async (record_id: number, refetchDiaryRecords: () => void) => {
    apiRequest(
        { url: `diary/delete_diary_record?record_id=${record_id}`, method: 'POST' },
        { successMessage: 'Record deleted successfully' }
    )
    refetchDiaryRecords()
}
