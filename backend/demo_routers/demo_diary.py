from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from demo_db import get_db
from sqlalchemy import text
from models import Diary

router = APIRouter(prefix='/diary', tags=["diary"])

@router.get('/get_diary_records')
def get_diary_records(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT * FROM diary WHERE user_id = 'demo-user-id'
    """)).fetchall()
    
    records = []
    for row in result:
        records.append({
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "created_time": row[3],
            "record_type": row[4],
            "user_id": row[5]
        })
    return records

@router.post('/add_diary_record')
def add_diary(data: Diary, db: Session = Depends(get_db)):
    return {
        "message": "Запись дневника успешно добавлена",
        "record": {
            "id": "new-demo-record",
            "title": data.title,
            "description": data.description,
            "record_type": data.record_type,
            "created_time": "2024-11-01T15:00:00"
        }
    }

@router.post('/delete_diary_record')
def delete(record_id: int):
    return {"message": f"Запись дневника {record_id} удалена"}

@router.post('/update_diary_record')
def update(record: Diary, record_id: int):
    return {
        "message": f"Запись дневника {record_id} обновлена",
        "record": {
            "id": record_id,
            "title": record.title,
            "description": record.description,
            "record_type": record.record_type
        }
    }

@router.get('/stats')
async def get_diary_stats(db: Session = Depends(get_db)):
    return {
        "total_records": 3,
        "records_by_type": {
            "Позитив": 1,
            "Идеи": 1,
            "Планы": 1
        },
        "recent_records": 3
    }
