from auth.auth import get_current_user_id
from queries import tasks
from models import Task
from fastapi import APIRouter, HTTPException, Request

router = APIRouter(prefix='/tasks', tags=["Tasks"])

@router.get('/get_tasks')
def get_tasks(request: Request):
    user_id = get_current_user_id(request)
    return tasks.select_tasks(user_id)

@router.post('/add_task')
def add_task(request: Request, task: Task):
    user_id = get_current_user_id(request)
    return tasks.insert_task(task, user_id)

@router.post('/delete_task')
def delete(task_id: int):
    return tasks.delete_task(task_id)

@router.post('/update_task')
def update(task: Task, task_id: int):
    return tasks.update_task(task, task_id)