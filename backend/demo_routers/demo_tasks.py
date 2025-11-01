from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from demo_db import get_db
from sqlalchemy import text
from models import Task

router = APIRouter(prefix='/tasks', tags=["Tasks"])

@router.get('/get_tasks')
def get_tasks(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT * FROM tasks WHERE user_id = 'demo-user-id'
    """)).fetchall()
    
    tasks = []
    for row in result:
        tasks.append({
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "type": row[3],
            "difficulty": row[4],
            "status": row[5],
            "created_time": row[6],
            "finished_time": row[7],
            "user_id": row[8]
        })
    return tasks

@router.post('/add_task')
def add_task(task: Task, db: Session = Depends(get_db)):
    return {
        "message": "Задача успешно добавлена",
        "task": {
            "id": "new-demo-task",
            "title": task.title,
            "description": task.description,
            "type": task.type,
            "difficulty": task.difficulty,
            "status": task.status
        }
    }

@router.post('/delete_task')
def delete(task_id: int):
    return {"message": f"Задача {task_id} удалена"}

@router.post('/update_task')
def update(task: Task, task_id: int):
    return {
        "message": f"Задача {task_id} обновлена",
        "task": {
            "id": task_id,
            "title": task.title,
            "description": task.description,
            "type": task.type,
            "difficulty": task.difficulty,
            "status": task.status
        }
    }

@router.get('/stats')
async def get_tasks_stats(db: Session = Depends(get_db)):
    return {
        "total_tasks": 3,
        "completed_tasks": 1,
        "in_progress_tasks": 2,
        "average_difficulty": 2.0
    }
