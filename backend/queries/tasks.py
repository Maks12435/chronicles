from datetime import datetime
from uuid import UUID
from sqlalchemy import select, update
from db import session_factory
from models import Task, TasksTable
        
def select_tasks(user_id):
    with session_factory() as session:
        query = (
            select(TasksTable)
            .order_by(TasksTable.created_time.desc())
            .where(TasksTable.user_id == user_id)        
        )
        result = session.execute(query)
        tasks = result.scalars().all()

        return [task for task in tasks]
    
def insert_task(task: Task, user_id: UUID):
    with session_factory() as session:
        db_task = TasksTable(**task.model_dump()) 
        db_task.user_id = user_id 
        session.add(db_task)
        session.commit()
        
def delete_task(task_id: int):
    with session_factory() as session:
        task = session.get(TasksTable, task_id)
        if task:
            session.delete(task)
            session.commit()
            return {"message": "task deleted"}
        else:
            return {"error": "task not found"}

def update_task(updated_task: Task, task_id: int):
    with session_factory() as session:
        stmt = (
			update(TasksTable)
			.where(task_id == TasksTable.id)
			.values(title=updated_task.title, description=updated_task.description, type=updated_task.type, status=updated_task.status, difficulty=updated_task.difficulty, finished_time=datetime.now())
		) 
        session.execute(stmt)
        session.commit()