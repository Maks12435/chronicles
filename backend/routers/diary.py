from auth.auth import get_current_user_id
from queries import diary
from models import Diary
from fastapi import APIRouter, HTTPException, Request

router = APIRouter(prefix='/diary', tags=["diary"])

@router.get('/get_diary_records')
def get_diary_records(request: Request):
    user_id = get_current_user_id(request)
    return diary.select_diary(user_id)

@router.post('/add_diary_record')
def add_diary(request: Request, data: Diary):
    user_id = get_current_user_id(request)
    try:
        return diary.insert_diary(data, user_id)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.post('/delete_diary_record')
def delete(record_id: int):
    return diary.delete_diary(record_id)

@router.post('/update_diary_record')
def update(record: Diary, record_id: int):
    return diary.update_diary(record, record_id)

