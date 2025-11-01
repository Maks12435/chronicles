from services.footballapi import parse_league_table
from queries import football
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix='/football', tags=["Football"])

@router.get('/get_matches')
def get_matches():
    return football.select_matches()

@router.get('/get_table')
def get_table(league_name):
    return parse_league_table(league_name)