from datetime import datetime
from uuid import UUID
from sqlalchemy import exists, select, update
from db import session_factory
from models import Diary, DiaryTable
        
def select_diary(user_id: UUID):
    with session_factory() as session:
        query = (
            select(DiaryTable)
            .order_by(DiaryTable.created_time.desc())
            .where(DiaryTable.user_id == user_id)
        )

        result = session.execute(query).scalars().all()

        return [row for row in result]

def delete_diary(diary_id):
    with session_factory() as session:
        diary = session.get(DiaryTable, diary_id)
        if diary:
            session.delete(diary)
            session.commit()
            return {"message": "diary deleted"}
        else:
            return {"error": "diary not found"}

def diary_exists(session, diary_name: str) -> bool:
    stmt = select(exists().where(DiaryTable.title == diary_name))
    return session.scalar(stmt)

def insert_diary(diary: Diary, user_id: UUID):
    with session_factory() as session:
        diary_data = DiaryTable(**diary.model_dump())
        diary_data.user_id = user_id

        if diary_exists(session, diary_data.title):
            raise ValueError("A diary with this name already exists")
        
        session.add(diary_data)
        session.commit()
        
def update_diary(updated_record: Diary, record_id: int):
    with session_factory() as session:
        stmt = (
			update(DiaryTable)
			.where(record_id == DiaryTable.id)
			.values(title=updated_record.title, description=updated_record.description, record_type=updated_record.record_type)
		) 
        session.execute(stmt)
        session.commit()