from queries import orm
from fastapi import APIRouter

router = APIRouter(prefix='/football', tags=["Football"])

@router.get('/get_matches')
def get_matches():
    return orm.select_matches()
